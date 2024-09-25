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
import { tap } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { SafeStorageService } from '../../shared/services/safe-storage.service';

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
   * @param title
   * @param safeStorageService
   */
  constructor(
    protected title: Title,
    protected safeStorageService: SafeStorageService,
  ) {
    this.title.setTitle('Settings - SYCL.tech');

    safeStorageService.observe().pipe(
      tap((state) => {
        this.enableStorage.set(state['st-cookies-accepted'] == true);
        this.enableDarkMode.set(state['st-dark-mode-enabled'] == true);
        this.enableTracking.set(state['st-enable-tracking'] == true);
      })
    ).subscribe();
  }

  /**
   * Called when a user changes any of the settings.
   */
  onStateChanged() {
    if (!this.enableStorage()) {
      // If storage is now disabled, clear any existing stored values
      this.safeStorageService.clear();
      return ;
    }

    this.safeStorageService.save('st-cookies-accepted', this.enableStorage(), false);
    this.safeStorageService.save('st-dark-mode-enabled', this.enableDarkMode(), false);
    this.safeStorageService.save('st-enable-tracking', this.enableTracking());
  }
}
