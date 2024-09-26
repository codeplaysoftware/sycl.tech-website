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
  OnInit,
  signal,
  WritableSignal
} from '@angular/core';
import { Alert, AlertService } from '../../services/alert.service';
import { RouterLink } from '@angular/router';
import { tap } from 'rxjs';
import { PlatformService } from '../../services/platform.service';
import { SafeStorageService } from '../../services/safe-storage.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'st-alerts',
  standalone: true,
  templateUrl: './alerts.component.html',
  imports: [
    RouterLink,
    CommonModule,
  ],
  styleUrl: './alerts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideInTop', [
    transition(':enter', [
      style({ transform: 'translateY(-100%)' }),
      animate('500ms ease-out', style({ transform: 'translateY(0)' })),
    ]),
    transition(':leave', [
      animate('500ms ease-out', style({ transform: 'translateY(-100%)' })),
    ])
  ])
],
})
export class AlertsComponent implements OnInit {
  /**
   * The signal to store the currently visible alert for rendering via the template.
   * @protected
   */
  protected alert: WritableSignal<Alert | undefined> = signal(undefined);

  /**
   * Constructor.
   * @param platformService
   * @param safeStorageService
   * @param alertService
   */
  constructor(
    protected platformService: PlatformService,
    protected safeStorageService: SafeStorageService,
    protected alertService: AlertService
  ) { }

  /**
   * @inheritdoc
   */
  ngOnInit() {
    if (!this.platformService.isClient()) {
      return;
    }

    // If we are not allowed to store cookies allowing users to hide/block alerts, we shouldn't really show any of them
    // otherwise they will just annoy the user. In this case, just return and do nothing.
    if (!this.safeStorageService.allowed()) {
      return ;
    }

    this.alertService.observe()
      .pipe(
        tap((alert) => {
          this.alert.set(alert);
        })
      )
      .subscribe();
  }

  /**
   * Called when a user chooses to block/hide an alert.
   * @param alert
   */
  onBlockAlert(alert: Alert) {
    this.alertService.block(alert)
  }

  /**
   * Called when a user clicks on an alert.
   * @param alert
   */
  onAlertClicked(alert: Alert) {
    this.onBlockAlert(alert);
  }
}
