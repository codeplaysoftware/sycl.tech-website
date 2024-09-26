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

import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { SafeStorageService } from './safe-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  /**
   * An array of alerts to show to the user.
   * @protected
   */
  protected alerts: Alert[] = [];

  /**
   * Subject, used to notify observers of changes to the alerts.
   * @protected
   */
  protected behaviorSubject: BehaviorSubject<Alert | undefined> = new BehaviorSubject<Alert | undefined>(undefined);

  /**
   * Constructor.
   * @param safeStorageService
   */
  constructor(
    protected safeStorageService: SafeStorageService
  ) { }

  /**
   * Get an observable that will notify of any alert changes.
   */
  observe(): Observable<Alert | undefined> {
    return this.behaviorSubject;
  }

  /**
   * Add a new alert.
   * @param id
   * @param message
   * @param subMessage
   * @param icon
   * @param href
   */
  add(
    id: string,
    message: string,
    subMessage?: string,
    icon?: string,
    href?: string
  ) {
    // If the alert id is in the blocked list, exit early
    if (this.isAlertBlocked(id)) {
      return ;
    }

    this.alerts.push({
      id: id,
      icon: icon ?? 'notifications',
      message: message,
      subMessage: subMessage,
      href: href
    });

    this.notify();
  }

  /**
   * Block an alert.
   * @param alert
   */
  block(
    alert: Alert
  ) {
    // Remove the alert from the internal alert list by searching for it's id
    for (const alertIndex in this.alerts) {
      const currentAlert = this.alerts[alertIndex];

      if (currentAlert.id == alert.id) {
        this.alerts.splice(Number.parseInt(alertIndex), 1);
      }
    }

    let blockedAlerts = [];
    if (this.safeStorageService.has('st-blocked-alerts')) {
      blockedAlerts = this.safeStorageService.get('st-blocked-alerts');
    }

    blockedAlerts.push(alert.id);
    this.safeStorageService.save('st-blocked-alerts', blockedAlerts);

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
    this.behaviorSubject.next(this.getNextAlert());
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
  getNextAlert(): Alert | undefined {
    const alerts = this.alerts.slice();

    if (alerts.length == 0) {
      return undefined;
    }

    return alerts[0];
  }
}

/**
 * Represents an alert.
 */
export interface Alert {
  id: string
  icon: string
  message: string
  subMessage?: string
  href?: string
}
