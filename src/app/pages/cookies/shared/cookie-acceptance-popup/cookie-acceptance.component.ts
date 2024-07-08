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

import { ChangeDetectionStrategy, Component, signal, Signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StateService } from '../../../../shared/services/state.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { PlatformService } from '../../../../shared/services/platform.service';

@Component({
  selector: 'st-cookie-acceptance',
  standalone: true,
  templateUrl: './cookie-acceptance.component.html',
  imports: [
    RouterLink,
    AsyncPipe
  ],
  styleUrl: './cookie-acceptance.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CookieAcceptanceComponent {
  protected readonly show: Signal<boolean> = signal(false);

  /**
   * Constructor.
   * @param stateService
   * @param platformService
   */
  constructor(
    protected stateService: StateService,
    protected platformService: PlatformService
  ) {
    // Only show the dialog on client to avoid flickering (dialog will be rendered during pre-rendering).
    if (this.platformService.isClient()) {
      this.show = toSignal(this.stateService.getObservable().pipe(
        map((state) => {
          return (state.cookiesAccepted === undefined);
        }),
      ), { initialValue: false });
    }
  }

  /**
   * Called when a user accepts our policies.
   */
  onAcceptPolicies() {
    this.stateService.setStoragePolicyAccepted(true);
  }

  /**
   * Called when a user rejects our policies.
   */
  onRejectPolicies() {
    this.stateService.setStoragePolicyAccepted(false);
  }
}
