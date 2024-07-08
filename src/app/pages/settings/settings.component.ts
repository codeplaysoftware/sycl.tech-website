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

import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwitchComponent } from '../../shared/components/switch/switch.component';
import { StateService } from '../../shared/services/state.service';
import { tap } from 'rxjs';

@Component({
  selector: 'st-settings',
  standalone: true,
  imports: [
    CommonModule,
    SwitchComponent
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {
  enableStorage: WritableSignal<boolean> = signal(false);
  enableDarkMode: WritableSignal<boolean> = signal(false);
  enableTracking: WritableSignal<boolean> = signal(false);

  /**
   * Constructor.
   * @param stateService
   */
  constructor(
    protected stateService: StateService
  ) {
    stateService.getObservable().pipe(
      tap((state) => {
        this.enableDarkMode.set(state.darkModeEnabled);
        this.enableStorage.set(state.cookiesAccepted ? state.cookiesAccepted : false);
        this.enableTracking.set(state.enableTracking);
      })
    ).subscribe();
  }

  /**
   * Called when a user changes any of the settings.
   */
  onStateChanged() {
    const state = this.stateService.snapshot();
    state.enableTracking = this.enableTracking();
    state.darkModeEnabled = this.enableDarkMode();
    state.cookiesAccepted = this.enableStorage();
    this.stateService.update(state);
  }
}
