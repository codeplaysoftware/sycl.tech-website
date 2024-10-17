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

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  OnChanges,
  Signal,
  signal,
  WritableSignal
} from '@angular/core';
import { LoadingState } from '../../../../shared/LoadingState';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { SyntaxCodeBlockComponent } from '../../../../shared/components/syntax-code-block/syntax-code-block.component';
import { PlaygroundService } from '../../../../shared/services/models/playground.service';
import { CompilationResultModel } from '../../../../shared/models/compilation-result.model';
import { PlaygroundSampleModel } from '../../../../shared/models/playground-sample.model';
import { Router, RouterLink } from '@angular/router';
import { delay, of, take, tap } from 'rxjs';

@Component({
  selector: 'st-mini-playground-code-block',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LoadingComponent,
    SyntaxCodeBlockComponent
  ],
  templateUrl: './mini-playground-code-block.component.html',
  styleUrl: './mini-playground-code-block.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MiniPlaygroundCodeBlockComponent implements OnChanges {
  sample = input<PlaygroundSampleModel>();
  startLine = input<number>(0);
  endLine = input<number | undefined>(undefined);
  highlight = input<boolean>(true);
  caretColor = input<string>('white');
  editable = input<boolean>(true);

  protected readonly LoadingState = LoadingState;
  protected readonly state: WritableSignal<LoadingState> = signal(LoadingState.NOT_STARTED);
  protected readonly compilationResponse: WritableSignal<CompilationResultModel | undefined> = signal(undefined);
  protected readonly snippet: WritableSignal<string> = signal('');
  protected readonly fullCode: Signal<string>;

  protected snippedOriginalLength: number = 0;
  protected snippedIndentation: number = 0;

  /**
   * Constructor.
   * @param playgroundService
   * @param router
   */
  constructor(
    protected playgroundService: PlaygroundService,
    protected router: Router
  ) {
    this.fullCode = computed(() => {
      const sample = this.sample();
      const snippet = this.snippet();
      const startLine = this.startLine();

      if (!sample) {
        return '';
      }

      const sampleCodeLines = sample.code.split('\n');
      const snippetLines = snippet.split('\n').map(line => {
        return line.length > 0 ? ' '.repeat(this.snippedIndentation) + line : line;
      });
      sampleCodeLines.splice(startLine - 1, this.snippedOriginalLength, ...snippetLines);
      return sampleCodeLines.join('\n');
    });
  }

  /**
   * @inheritDoc
   */
  ngOnChanges(): void {
    this.snippet.update(computed(() => {
      const sample = this.sample();

      if (!sample) {
        return '';
      }

      const sampleCodeLines = sample.code.split('\n');
      const endLine = this.endLine() ?? sampleCodeLines.length;
      const snippetLines = sampleCodeLines.slice(this.startLine() - 1, endLine);
      this.snippedOriginalLength = snippetLines.length;

      if (snippetLines.length > 0) {
        this.snippedIndentation = snippetLines[0].length - snippetLines[0].trim().length;
      }

      return snippetLines.map(line => line.slice(this.snippedIndentation)).join('\n');
    }));
  }

  /**
   * Compile the code.
   */
  compile() {
    try {
      this.state.set(LoadingState.LOADING);

      // In order to avoid snippets taking a long time to execute, we'll sometimes return a cached response
      // if the user code is exactly the same as the original sample code.
      if (this.fullCode() == this.sample()?.code && this.sample()?.cached_response) {
        const compileResponse = PlaygroundService.getEmptyResult();
        compileResponse.result = this.sample()?.cached_response;
        compileResponse.platform = 'Cache';

        of(compileResponse).pipe(
          delay(1000),
          tap((compileResponse) => this.compilationResponse.set(compileResponse)),
          tap(() => this.state.set(LoadingState.LOAD_SUCCESS)),
          take(1)).subscribe();

        return ;
      }

      this.playgroundService.compile(this.fullCode()).pipe(
        tap((compilationResult) => {
          this.state.set(
            compilationResult.isError() ? LoadingState.LOAD_FAILURE : LoadingState.LOAD_SUCCESS);
        }),
        tap((compilationResult) => {
          this.compilationResponse.set(compilationResult);
        }),
        take(1)
      ).subscribe();

    } catch (e) {
      this.state.set(LoadingState.NOT_STARTED);
      alert(e);
    }
  }

  /**
   * Open the current sample code into the playground.
   */
  onOpenInPlayground() {
    const customSample = Object.assign({}, this.sample());
    customSample.code = this.fullCode();

    this.playgroundService.setSample(customSample);
    this.router.navigateByUrl('/playground').then(() => {});
  }
}
