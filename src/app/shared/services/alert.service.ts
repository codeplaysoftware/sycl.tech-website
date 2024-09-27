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

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { SafeStorageService } from './safe-storage.service';
import { PlatformService } from './platform.service';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  /**
   * Storage key for the cookie service.
   */
  public static readonly ENABLE_ALERTS_STORAGE_KEY = 'st-enable-alerts';

  /**
   * Default timeout for an alert.
   */
  public static readonly DEFAULT_TIMEOUT = 4000;

  /**
   * If the service is enabled or not.
   * @protected
   */
  protected enabled: boolean = false;

  /**
   * An array of alerts to show to the user.
   * @protected
   */
  protected alerts: Alert[] = [];

  /**
   * Subject, used to notify observers of changes to the alerts.
   * @protected
   */
  protected behaviorSubject: BehaviorSubject<Alert[]> = new BehaviorSubject<Alert[]>([]);

  /**
   * Constructor.
   * @param safeStorageService
   * @param platformService
   */
  constructor(
    protected safeStorageService: SafeStorageService,
    protected platformService: PlatformService,
  ) {
    this.safeStorageService.observe()
      .pipe(
        tap((state) => {
          this.enabled = state[AlertService.ENABLE_ALERTS_STORAGE_KEY] ?? false;

          if (this.enabled) {
            this.notify();
          }
        })
      )
      .subscribe();
  }

  /**
   * Get an observable that will notify of any alert changes.
   */
  observe(): Observable<Alert[]> {
    return this.behaviorSubject;
  }

  /**
   * Add a new alert.
   * @param alert
   */
  add(
    alert: Alert
  ) {
    // Don't do anything if we are not a client
    if (!this.platformService.isClient()) {
      return ;
    }

    // If the service is disabled or if the alert is blocked, don't show it
    if (this.isAlertBlocked(alert.id)) {
      console.error('Not showing alert, service is disabled or alert is blocked.');
      return ;
    }

    this.alerts.push(alert);

    this.notify();

    if (alert.persistent) {
      return ;
    }

    setTimeout(() => {
      this.delete(alert);
    }, AlertService.DEFAULT_TIMEOUT);
  }

  /**
   * Block an alert.
   * @param alert
   */
  block(
    alert: Alert
  ) {
    let blockedAlerts = [];
    if (this.safeStorageService.has('st-blocked-alerts')) {
      blockedAlerts = this.safeStorageService.get('st-blocked-alerts');
    }

    blockedAlerts.push(alert.id);
    this.safeStorageService.save('st-blocked-alerts', blockedAlerts);

    this.delete(alert);
  }

  /**
   * Delete an alert.
   * @param alert
   */
  delete(
    alert: Alert
  ) {
    this.deleteById(alert.id);
  }

  /**
   * Delete an alert by its id.
   * @param alertId
   */
  deleteById(
    alertId: string
  ) {
    // Remove the alert from the internal alert list by searching for it's id
    for (const alertIndex in this.alerts) {
      const currentAlert = this.alerts[alertIndex];

      if (currentAlert.id == alertId) {
        this.alerts.splice(Number.parseInt(alertIndex), 1);
      }
    }

    this.notify();
  }

  /**
   * Check if the alert id is within the block list.
   * @param alertId
   */
  isAlertBlocked(
    alertId: string
  ): boolean {
    if (this.safeStorageService.has('st-blocked-alerts')) {
      return this.safeStorageService.get('st-blocked-alerts').includes(alertId);
    }

    return false;
  }

  /**
   * Notify any subscribed users that there are new alerts.
   */
  notify() {
    if (!this.enabled) {
      return ;
    }

    this.behaviorSubject.next(this.getAlerts());
  }

  /**
   * Check if there are alerts available.
   */
  has(): boolean {
    return this.alerts.length > 0;
  }

  /**
   * Gets the next alert in the alert list.
   */
  getAlerts(): Alert[] {
    return this.alerts.slice();
  }
}

/**
 * Represents an alert.
 */
export interface Alert {
  id: string
  icon: string
  title: string
  persistent?: boolean
  description?: string
  href?: string
}
