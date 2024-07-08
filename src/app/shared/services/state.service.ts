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

import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  protected stateSubject: BehaviorSubject<ApplicationState>;

  /**
   * Constructor.
   * @param storageService
   */
  constructor(
    @Inject(LOCAL_STORAGE) private storageService: StorageService
  ) {
    const applicationState: ApplicationState = {
      cookiesAccepted: this.getStorageServiceValue('st-cookies-accepted'),
      darkModeEnabled: this.getStorageServiceValue('st-dark-mode-enabled', false),
      enableTracking: this.getStorageServiceValue('st-enable-tracking', true)
    }

    this.stateSubject = new BehaviorSubject<ApplicationState>(applicationState);
  }

  getStorageServiceValue(key: string, defaultValue?: any) {
    if (!this.storageService.has(key)) {
      return defaultValue;
    }

    const value = this.storageService.get(key);

    if (value == undefined || value == 'undefined') {
      return defaultValue;
    }

    return value;
  }

  /**
   * Get the state observable that can be subscribed to for update changes.
   */
  getObservable(): Observable<ApplicationState> {
    return this.stateSubject;
  }

  /**
   * Get the latest state snapshot. Avoid using this in reactive circumstances.
   */
  snapshot() {
    return this.stateSubject.value;
  }

  /**
   * Set the dark mode state.
   * @param enabled
   */
  setDarkMode(enabled: boolean) {
    const state = this.snapshot();
    state.darkModeEnabled = enabled;
    this.update(state);
  }

  /**
   * Set the storage acceptance policy.
   * @param enabled
   */
  setStoragePolicyAccepted(enabled: boolean | undefined) {
    const state = this.snapshot();
    state.cookiesAccepted = enabled;
    this.update(state);
  }

  /**
   * Update the state.
   * @param state
   */
  update(state: ApplicationState) {
    if (!state.cookiesAccepted) {
      this.storageService.clear();
      this.storageService.set('st-cookies-accepted', state.cookiesAccepted);
      return ;
    }

    this.storageService.set('st-cookies-accepted', state.cookiesAccepted);
    this.storageService.set('st-dark-mode-enabled', state.darkModeEnabled);
    this.storageService.set('st-enable-tracking', state.enableTracking);
    this.stateSubject.next(state);
  }
}

/**
 * Interface that represents the state of the application.
 */
export interface ApplicationState {
  cookiesAccepted: boolean | undefined
  darkModeEnabled: boolean
  enableTracking: boolean
}
