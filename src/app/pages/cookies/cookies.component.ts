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

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { StateService } from '../../shared/services/state.service';

@Component({
  selector: 'st-cookies',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './cookies.component.html',
  styleUrl: './cookies.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CookiesComponent {
  protected readonly environment = environment;

  /**
   * Constructor.
   * @param stateService
   */
  constructor(
    protected stateService: StateService
  ) { }

  /**
   * Called when a user wishes to change their cookie/storage acceptance.
   */
  onStorageAcceptance() {
    this.stateService.setStoragePolicyAccepted(undefined);
  }
}
