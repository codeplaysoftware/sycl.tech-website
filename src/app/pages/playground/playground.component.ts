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
  Component, effect, Inject,
  OnDestroy, OnInit, Renderer2,
  signal,
  Signal,
  ViewChild,
  WritableSignal
} from '@angular/core';
import { CommonModule, DOCUMENT, NgOptimizedImage } from '@angular/common';
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
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SharePopupComponent } from './shared/share-popup/share-popup.component';
import { LoadAndSavePopupComponent } from './shared/load-and-save-popup/load-and-save-popup.component';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import {
  CompilerSelectorPopupComponent
} from './shared/compiler-selector-popup/compiler-selector-popup.component';

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
  protected readonly sourcePanelViewState: WritableSignal<PanelViewState> = signal(PanelViewState.NORMAL);
  protected readonly asmPanelViewState: WritableSignal<PanelViewState> = signal(PanelViewState.NORMAL);
  protected readonly execPanelViewState: WritableSignal<PanelViewState> = signal(PanelViewState.NORMAL);
  protected readonly errorPanelViewState: WritableSignal<PanelViewState> = signal(PanelViewState.HIDDEN);
  protected readonly compilationResult: Signal<CompilationResultModel | undefined>;
  protected readonly compileState: WritableSignal<LoadingState> = signal(LoadingState.NOT_STARTED);
  protected readonly sample: WritableSignal<PlaygroundSampleModel | undefined>  = signal(undefined);
  protected readonly monacoEditorTheme: Signal<string> = toSignal(this.getEditorTheme(), { initialValue: 'vs-light' });
  protected readonly showMonacoEditor: WritableSignal<boolean> = signal(false);
  protected readonly code: WritableSignal<string> = signal('');
  protected readonly lastRunCode: WritableSignal<string> = signal('');
  protected readonly loadingMessage: WritableSignal<string> = signal('Loading source code...');
  protected readonly sourceCodeEditorReady: WritableSignal<boolean> = signal(false);
  protected readonly fullscreenMode: WritableSignal<boolean> = signal(false);

  protected compilationResult$: BehaviorSubject<CompilationResultModel | undefined>;
  protected popupReference: PopupReference | undefined;
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
   * @param storageService
   * @param document
   * @param renderer
   * @param router
   */
  constructor(
    protected titleService: Title,
    protected meta: Meta,
    protected popupService: PopupService,
    protected platformService: PlatformService,
    protected playgroundService: PlaygroundService,
    protected stateService: StateService,
    protected activatedRoute: ActivatedRoute,
    @Inject(LOCAL_STORAGE) protected storageService: StorageService,
    @Inject(DOCUMENT) protected document: Document,
    protected renderer: Renderer2,
    protected router: Router
  ) {
    this.titleService.setTitle('Playground - SYCL.tech');
    this.meta.addTag({ name: 'keywords', content: this.getKeywords().join(', ') });
    this.meta.addTag({ name: 'description', content: this.getDescription() });

    this.showMonacoEditor.set(this.platformService.isClient());
    this.compilationResult$ = new BehaviorSubject<CompilationResultModel | undefined>(undefined);
    this.compilationResult = toSignal(this.compilationResult$, { initialValue: undefined });

    // Effect to handle full screen mode
    effect(() => {
      const fs = this.fullscreenMode();

      const topNav = document.body.querySelectorAll('nav');
      const topFooter = document.body.querySelectorAll('footer');

      if (topNav.length == 0 || topFooter.length == 0) {
        return;
      }

      if (fs) {
        this.renderer.addClass(topNav[0], 'hidden');
        this.renderer.addClass(topFooter[0], 'hidden');
      } else {
        this.renderer.removeClass(topNav[0], 'hidden');
        this.renderer.removeClass(topFooter[0], 'hidden');
      }

      // Update query params with fs value
      const queryParams: Params = { fs: fs ? true : null };
      this.router.navigate([], {
        relativeTo: this.activatedRoute, queryParams, queryParamsHandling: 'merge'}).then();
    });
  }

  /**
   * @inheritDoc
   */
  ngOnInit() {
    this.loadingMessage.set('Loading source code...')

    this.routerArgsSub = this.activatedRoute.queryParams.pipe(
      tap((params) => {
        if (params['s']) {
          this.loadingMessage.set('Loading your saved source code...')
          this.playgroundService.loadCodeSample(params['s']).subscribe((response) => {
            this.setCode(response);
          })
        } else {
          this.playgroundService.getSample().pipe(
            tap((sample) => {
              setTimeout(() => {
                if (sample == undefined) {
                  this.setSample(PlaygroundSampleService.getDefaultSample());

                  if (this.storageService.has(LoadAndSavePopupComponent.storageKey)) {
                    this.onSaveLoadSample();
                  } else if (this.platformService.isClient()) {
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

        // Enable full screen mode if its set via params
        if (params['fs'] === 'true') {
          this.fullscreenMode.set(true);
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
    this.popupReference?.close();
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
    firstValueFrom(this.popupReference.onChanged).then((sample) => {
      if (!sample) {
        return ;
      }

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
   * Check if the source code editor is ready.
   */
  isSourceCodeEditorReady(): boolean {
    return this.sourceCodeEditorReady();
  }

  /**
   * Called when the source code editor is ready to be shown.
   */
  onSourceCodeEditorReady() {
    this.sourceCodeEditorReady.set(true);
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
      'code': this.code(),
      'fullScreen': this.fullscreenMode()
    }, true);
  }

  /**
   * Called when a user presses the save/load code button.
   */
  onSaveLoadSample() {
    this.popupReference = this.popupService.create(LoadAndSavePopupComponent, {
      'code': this.code()
    }, true);

    // Subscribe to any save code samples and load them into the editor
    this.popupReference.onChanged.pipe(
      tap((data) => {
        if (data) {
          this.setCode(data.code);
        }
      }),
      take(1)
    ).subscribe();
  }

  /**
   * Called when a user wishes to change the compiler used.
   */
  onChooseCompiler() {
    this.popupReference = this.popupService.create(
      CompilerSelectorPopupComponent, null, true);
  }

  /**
   * Called when a user chooses to view the playground in fullscreen mode.
   */
  onToggleFullscreen() {
    this.fullscreenMode.set(!this.fullscreenMode());
  }
}
