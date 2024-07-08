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

import { ChangeDetectionStrategy, Component, Inject, signal, Signal } from '@angular/core';
import { PopupReference } from '../../../../shared/components/popup/PopupService';

@Component({
  selector: 'st-platform-info-popup',
  standalone: true,
  templateUrl: './platform-info-popup.component.html',
  styleUrl: './platform-info-popup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlatformInfoPopupComponent {
  protected readonly platformName: Signal<string>;

  /**
   * Constructor.
   * @param popupReference
   */
  constructor(
    @Inject('POPUP_DATA') protected popupReference: PopupReference
  ) {
    this.platformName = signal(this.popupReference.data['platform']);
  }
}
