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
  computed,
  Inject,
  OnInit,
  Signal,
  signal
} from '@angular/core';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { PopupReference } from '../../../../shared/components/popup/popup.service';
import { RouterLink } from '@angular/router';
import { PlaygroundCompiler, PlaygroundService } from '../../../../shared/services/models/playground.service';

@Component({
  selector: 'st-compiler-selector',
  standalone: true,
  templateUrl: './compiler-selector-popup.component.html',
  styleUrls: [
    '../../../../shared/components/popup/styles/slim-top-header.scss',
    './compiler-selector-popup.component.scss'
  ],
  imports: [
    LoadingComponent,
    DatePipe,
    RouterLink,
    NgOptimizedImage
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompilerSelectorPopupComponent implements OnInit {
  /**
   * Signal for the list of available compilers.
   * @protected
   */
  protected supportedCompilers: Signal<PlaygroundCompiler[]> = signal([]);

  /**
   * Signal for the current selected compiler.
   * @protected
   */
  protected selectedCompiler: Signal<PlaygroundCompiler | null> = signal(null);

  /**
   * Constructor.
   * @param popupReference
   * @param playgroundService
   */
  constructor(
    @Inject('POPUP_DATA') protected popupReference: PopupReference,
    protected playgroundService: PlaygroundService,
  ) { }

  /**
   * @inheritDoc
   */
  ngOnInit(): void {
    this.supportedCompilers = computed(
      () => this.playgroundService.supportedCompilers);

    this.selectedCompiler = computed(
      () => this.playgroundService.selectedCompiler());
  }

  /**
   * Called when a user chooses a particular compiler.
   * @param compiler
   */
  onSelectCompiler(compiler: PlaygroundCompiler) {
    this.playgroundService.selectedCompiler.set(compiler);
    this.popupReference.close(compiler);
  }

  /**
   * Determine if the provided compiler is the same as the currently selected.
   * @param compiler
   */
  isSelected(compiler: PlaygroundCompiler): boolean {
    return this.selectedCompiler()?.tag == compiler.tag;
  }
}
