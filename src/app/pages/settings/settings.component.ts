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

import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwitchComponent } from '../../shared/components/switch/switch.component';
import { Subscription, tap } from 'rxjs';
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
export class SettingsComponent implements OnInit, OnDestroy {
  /**
   * Signal for the enable storage switch.
   * @protected
   */
  protected enableStorage: WritableSignal<boolean> = signal(false);

  /**
   * Signal for the enable dark mode switch.
   * @protected
   */
  protected enableDarkMode: WritableSignal<boolean> = signal(false);

  /**
   * Signal for the enable tracking switch.
   * @protected
   */
  protected enableTracking: WritableSignal<boolean> = signal(false);

  /**
   * Signal for the enable alerts switch.
   * @protected
   */
  protected enableAlerts: WritableSignal<boolean> = signal(false);

  /**
   * Subscription to tracking storage changes.
   * @protected
   */
  protected storageSubscription?: Subscription;

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
  }

  /**
   * @inheritdoc
   */
  ngOnInit(): void {
    this.storageSubscription = this.safeStorageService.observe().pipe(
      tap((state) => {
        this.enableStorage.set(state['st-cookies-accepted'] == true);
        this.enableDarkMode.set(state['st-dark-mode-enabled'] == true);
        this.enableTracking.set(state['st-enable-tracking'] != false);
        this.enableAlerts.set(state['st-enable-alerts'] == true);
      })
    ).subscribe();
  }

  /**
   * @inheritdoc
   */
  ngOnDestroy(): void {
    this.storageSubscription?.unsubscribe();
  }

  /**
   * Called when a user changes any of the settings.
   */
  onStateChanged(key: string, value: any) {
    this.safeStorageService.save(key, value);
  }
}
