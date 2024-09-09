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
  signal,
  Signal,
  WritableSignal
} from '@angular/core';
import { PopupReference } from '../../../../shared/components/popup/PopupService';
import { PlaygroundService } from '../../../../shared/services/models/playground.service';
import { LoadingState } from '../../../../shared/LoadingState';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { catchError, of, take, tap } from 'rxjs';
import { CopyInputComponent } from './shared/copy-input/copy-input.component';

@Component({
  selector: 'st-share-popup',
  standalone: true,
  templateUrl: './share-popup.component.html',
  styleUrls: [
    '../../../../shared/components/popup/styles/common.scss',
    '../../../../shared/components/popup/styles/default-top-header.scss',
    './share-popup.component.scss'
  ],
  imports: [
    LoadingComponent,
    CopyInputComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharePopupComponent {
  protected readonly LoadingState = LoadingState;

  protected readonly code: Signal<string>;
  protected readonly syclTechUrl: Signal<string>;
  protected readonly fullscreenMode: Signal<boolean>;

  protected readonly loading: WritableSignal<LoadingState> = signal(LoadingState.LOADING);
  protected readonly compilerExplorerUrl: WritableSignal<string | undefined> = signal(undefined);

  /**
   * Constructor.
   * @param popupReference
   * @param playgroundService
   */
  constructor(
    @Inject('POPUP_DATA') protected popupReference: PopupReference,
    protected playgroundService: PlaygroundService
  ) {
    this.code = signal(this.popupReference.data['code']);
    this.fullscreenMode = signal(this.popupReference.data['fullScreen']);

    this.playgroundService.createCodeSampleUrl(this.code()).pipe(
      tap((url) => {
        this.compilerExplorerUrl.set(url);
        this.loading.set(LoadingState.LOAD_SUCCESS);
      }),
      catchError(() => {
        this.loading.set(LoadingState.LOAD_FAILURE);
        return of();
      }),
      take(1)
    ).subscribe();

    // Update the sycl.tech url based on compiler explorer url
    this.syclTechUrl = computed(() => {
      const compilerExplorerUrl = this.compilerExplorerUrl();
      const fullscreenMode = this.fullscreenMode();
      let syclTechUrl = '';

      if (compilerExplorerUrl == undefined) {
        return '';
      }

      syclTechUrl = compilerExplorerUrl
        .replace('https://godbolt.org/z/', 'https://sycl.tech/playground?s=');

      if (fullscreenMode) {
        syclTechUrl += '&fs=true';
      }

      return syclTechUrl;
    });
  }

  /**
   * Called when the user presses the close button.
   */
  onClose() {
    this.popupReference.close(null);
  }
}
