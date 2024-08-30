/*---------------------------------------------------------------------------------------------
 *
 *  Copyright (C) Codeplay Software Ltd.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 *--------------------------------------------------------------------------------------------*/

import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy, OnInit,
  signal,
  Signal,
  ViewChild,
  WritableSignal
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { LoadingState } from '../../shared/LoadingState';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { FormsModule } from '@angular/forms';
import { ActionButton, MiniPanelComponent, MiniPanelState, PanelViewState } from './shared/mini-panel/mini-panel.component';
import { PopupReference, PopupService } from '../../shared/components/popup/PopupService';
import { SampleChooserComponent } from './shared/sample-chooser/sample-chooser.component';
import { InfoPanelComponent } from './shared/info-panel/info-panel.component';
import { PlaygroundSampleModel } from '../../shared/models/playground-sample.model';
import { PlatformService } from '../../shared/services/platform.service';
import { PlaygroundService } from '../../shared/services/models/playground.service';
import { BehaviorSubject, firstValueFrom, map, Observable, Subscription, take, tap } from 'rxjs';
import { CompilationResultModel } from '../../shared/models/compilation-result.model';
import { Meta, Title } from '@angular/platform-browser';
import { PlaygroundSampleService } from '../../shared/services/models/playground-sample.service';
import { AlertBubbleComponent } from '../../shared/components/alert-bubble/alert-bubble.component';
import { PlatformInfoPopupComponent } from './shared/platform-info-popup/platform-info-popup.component';
import { SearchablePage } from '../../shared/components/site-wide-search/SearchablePage';
import { StateService } from '../../shared/services/state.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { SharePopupComponent } from './shared/share-popup/share-popup.component';

@Component({
  selector: 'st-playground',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoadingComponent,
    MonacoEditorModule,
    MiniPanelComponent,
    AlertBubbleComponent,
    NgOptimizedImage
  ],
  templateUrl: './playground.component.html',
  styleUrl: './playground.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaygroundComponent implements SearchablePage, OnInit, OnDestroy {
  @ViewChild('codeBlock')
  protected readonly codeBlock: any;
  protected readonly LoadingState = LoadingState;
  protected readonly MiniPanelState = MiniPanelState;
  protected readonly PanelViewState = PanelViewState;
  protected readonly sourcePanelViewState: WritableSignal<PanelViewState>;
  protected readonly asmPanelViewState: WritableSignal<PanelViewState>;
  protected readonly execPanelViewState: WritableSignal<PanelViewState>;
  protected readonly errorPanelViewState: WritableSignal<PanelViewState>;
  protected readonly compilationResult: Signal<CompilationResultModel | undefined>;
  protected readonly compileState: WritableSignal<LoadingState>;
  protected readonly lastRunCode: WritableSignal<string>;
  protected readonly sample: WritableSignal<PlaygroundSampleModel | undefined>;
  protected readonly monacoEditorTheme: Signal<string>;
  protected readonly showMonacoEditor: WritableSignal<boolean>;

  protected compilationResult$: BehaviorSubject<CompilationResultModel | undefined>;
  protected popupReference: PopupReference | undefined;
  protected code: WritableSignal<string>;
  protected routerArgsSub: Subscription | undefined;

  /**
   * Constructor.
   * @param titleService
   * @param meta
   * @param popupService
   * @param platformService
   * @param playgroundService
   * @param stateService
   * @param activatedRoute
   */
  constructor(
    protected titleService: Title,
    protected meta: Meta,
    protected popupService: PopupService,
    protected platformService: PlatformService,
    protected playgroundService: PlaygroundService,
    protected stateService: StateService,
    protected activatedRoute: ActivatedRoute
  ) {
    this.titleService.setTitle('Playground - SYCL.tech');
    this.meta.addTag({ name: 'keywords', content: this.getKeywords().join(', ') });
    this.meta.addTag({ name: 'description', content: this.getDescription() });

    this.compilationResult$ = new BehaviorSubject<CompilationResultModel | undefined>(undefined);

    this.sourcePanelViewState = signal(PanelViewState.NORMAL);
    this.asmPanelViewState = signal(PanelViewState.NORMAL);
    this.execPanelViewState = signal(PanelViewState.NORMAL);
    this.errorPanelViewState = signal(PanelViewState.HIDDEN);
    this.showMonacoEditor = signal(this.platformService.isClient());
    this.monacoEditorTheme = toSignal(this.getEditorTheme(), { initialValue: 'vs-light' });
    this.compileState = signal(LoadingState.NOT_STARTED);
    this.compilationResult = toSignal(this.compilationResult$, { initialValue: undefined });
    this.code = signal('');
    this.lastRunCode = signal('');
    this.sample = signal(undefined);
  }

  /**
   * @inheritDoc
   */
  ngOnInit() {
    this.routerArgsSub = this.activatedRoute.queryParams.pipe(
      tap((params) => {
        if (params['s']) {
          this.playgroundService.loadCodeSample(params['s']).subscribe((response) => {
            this.setCode(response);
          })
        } else {
          this.playgroundService.getSample().pipe(
            tap((sample) => {
              setTimeout(() => {
                if (sample == undefined) {
                  this.setSample(PlaygroundSampleService.getDefaultSample());

                  if (this.platformService.isClient()){
                    this.onChooseSample();
                  }
                } else {
                  this.setSample(sample);
                }
              });
            }),
            take(1)
          ).subscribe();
        }
      }),
      take(1)
    ).subscribe();
  }

  /**
   * @inheritDoc
   */
  ngOnDestroy(): void {
    this.playgroundService.clearSample();
    this.popupReference?.close(undefined);
    this.routerArgsSub?.unsubscribe();
  }

  /**
   * Get the editor theme.
   */
  getEditorTheme(): Observable<string> {
    return this.stateService.getObservable().pipe(
      map(state => state.darkModeEnabled ? 'st-dark' : 'vs-light'));
  }

  /**
   * Check if the code is dirty, e.g, different from the last compile.
   */
  isDirty(): boolean {
    return this.lastRunCode() !== this.code();
  }

  /**
   * Checks if we are currently compiling.
   */
  isCompiling(): boolean {
    return this.compileState() === LoadingState.LOADING;
  }

  /**
   * Compile the code using compiler explorer.
   */
  compile(): Observable<CompilationResultModel> {
    this.sourcePanelViewState.set(PanelViewState.NORMAL);
    this.asmPanelViewState.set(PanelViewState.NORMAL);
    this.execPanelViewState.set(PanelViewState.NORMAL);
    this.errorPanelViewState.set(PanelViewState.HIDDEN);
    this.compileState.set(LoadingState.LOADING);

    return this.playgroundService.compile(this.code()).pipe(
      tap((compilationResult) => {
        if (compilationResult.isError()) {
          this.compileState.set(LoadingState.LOAD_FAILURE);
          this.showErrorPanel();
        } else {
          this.compileState.set(LoadingState.LOAD_SUCCESS);
        }
      })
    );
  }

  /**
   * Called when a user triggers the compile action.
   */
  onCompile() {
    if (this.isCompiling()) {
      alert('Currently compiling, please wait or refresh the page.');
      return ;
    }

    if (this.code().length < 10) {
      alert('Please enter some code before attempting to compile.');
      return ;
    }

    this.compile().pipe(
      tap((result) => this.compilationResult$.next(result)),
      take(1)
    ).subscribe();
  }

  /**
   * Set the current sample.
   * @param sample
   */
  setSample(sample: PlaygroundSampleModel) {
    this.titleService.setTitle(sample.title + ' - Playground - SYCL.tech');

    if (this.codeBlock) {
      this.setCode(sample.code);
    }
  }

  /**
   * Set code.
   * @param code
   */
  setCode(code: string) {
    this.code.set(code);
    this.lastRunCode.set(code);
  }

  /**
   * Called when a user presses buttons on the mini panels.
   * @param panelName
   * @param actionButton
   */
  onMiniPanelActionButtonPressed(panelName: string, actionButton: ActionButton) {
    if ('source' === panelName && 'Run' === actionButton.name) {
      return this.onCompile();
    }
  }

  /**
   * Show the error panel.
   */
  showErrorPanel() {
    this.execPanelViewState.set(PanelViewState.HIDDEN);
    this.errorPanelViewState.set(PanelViewState.NORMAL);
  }

  /**
   * Set the internal panel state.
   * @param panelName
   */
  getPanelState(panelName: string): MiniPanelState {
    if (this.isCompiling()) {
      return MiniPanelState.LOADING;
    }

    const compilationResult = this.compilationResult();

    if (!compilationResult) {
      return MiniPanelState.EMPTY;
    }

    if (panelName == 'asm' && compilationResult.hasAssembly()) {
      return MiniPanelState.SHOWING;
    } else if (panelName == 'exec' && compilationResult.hasResult()) {
      return MiniPanelState.SHOWING;
    }

    return MiniPanelState.EMPTY;
  }

  /**
   * Called when a user opens the sample chooser popup.
   */
  onChooseSample() {
    this.popupReference = this.popupService.create(SampleChooserComponent, null, true);
    firstValueFrom(this.popupReference.onChanged).then((sample: PlaygroundSampleModel) => {
      this.setSample(sample);
    });
  }

  /**
   * Called when a user opens hte info popup.
   */
  onShowInfoPanel() {
    this.popupReference = this.popupService.create(InfoPanelComponent, null, true);
  }

  /**
   * Called when a user clicks the target platform.
   */
  onTargetPlatformClicked() {
    const result = this.compilationResult();

    if (!result) {
      return ;
    }

    this.popupReference = this.popupService.create(PlatformInfoPopupComponent, {
      'platform': result.platform
    }, true);
  }

  /**
   * Check if we are ready to show the code.
   */
  isCodeReady(): boolean {
    return !!(this.showMonacoEditor() && this.sample);
  }

  /**
   * Determine what panels are currently visible based on their view state.
   * @param panelTag
   */
  isPanelVisible(panelTag: string) {
    if (this.sourcePanelViewState() === PanelViewState.MAXIMIZED && 'source' != panelTag) {
      return false;
    } else if (this.asmPanelViewState() === PanelViewState.MAXIMIZED && 'asm' != panelTag) {
      return false;
    } else if (this.execPanelViewState() === PanelViewState.MAXIMIZED && 'exec' != panelTag) {
      return false;
    } else if (this.errorPanelViewState() === PanelViewState.MAXIMIZED && 'error' != panelTag) {
      return false;
    }

    if ('source' == panelTag) {
      return this.sourcePanelViewState() === PanelViewState.NORMAL
        || this.sourcePanelViewState() === PanelViewState.MAXIMIZED;
    } else if ('asm' == panelTag) {
      return this.asmPanelViewState() === PanelViewState.NORMAL
        || this.asmPanelViewState() === PanelViewState.MAXIMIZED;
    } else if ('exec' == panelTag) {
      return this.execPanelViewState() === PanelViewState.NORMAL
        || this.execPanelViewState() === PanelViewState.MAXIMIZED;
    } else if ('error' == panelTag) {
      return this.errorPanelViewState() === PanelViewState.NORMAL
        || this.errorPanelViewState() === PanelViewState.MAXIMIZED;
    }

    return false;
  }

  /**
   * Called when the view state of a panel has changed.
   * @param panelTag
   * @param panelState
   */
  onPanelViewStateChanged(panelTag: string, panelState: PanelViewState) {
    if ('source' === panelTag) {
      this.sourcePanelViewState.set(panelState);
    } else if ('asm' === panelTag) {
      this.asmPanelViewState.set(panelState);
    } else if ('exec' === panelTag) {
      this.execPanelViewState.set(panelState);
    } else if ('error' === panelTag) {
      this.errorPanelViewState.set(panelState);
    }
  }

  /**
   * Check if any of the panels are maximized.
   */
  isAnyPanelMaximized(): boolean {
    return this.sourcePanelViewState() === PanelViewState.MAXIMIZED
      || this.asmPanelViewState() === PanelViewState.MAXIMIZED
      || this.execPanelViewState() === PanelViewState.MAXIMIZED
      || this.errorPanelViewState() === PanelViewState.MAXIMIZED;
  }

  /**
   * @inheritDoc
   */
  getKeywords(): string[] {
    return ['playground', 'samples', 'play', 'try']
  }

  /**
   * @inheritDoc
   */
  getTitle(): string {
    return 'Playground'
  }

  /**
   * @inheritDoc
   */
  getDescription(): string {
    return 'Try out the SYCL playground and compile and run SYCL in your browser!';
  }

  /**
   * @inheritDoc
   */
  getDefaultRoutePath(): string {
    return '/playground'
  }

  /**
   * Called when a user presses the share code button.
   */
  onShareSample() {
    this.popupReference = this.popupService.create(SharePopupComponent, {
      'code': this.code()
    }, true);
  }
}
