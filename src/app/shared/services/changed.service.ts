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
import { SafeStorageService } from './safe-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ChangedService {
  /**
   * The storage key to use for tracking the users last access date.
   * @protected
   */
  protected static readonly STORAGE_LAST_VISIT = 'st-last-visit-date';

  /**
   * Constructor.
   * @param safeStorageService
   */
  constructor(
    protected safeStorageService: SafeStorageService
  ) { }

  /**
   * Get the date of the users last known visit. Will return undefined if no date is saved.
   */
  lastVisitDate(): Date | undefined {
    if (this.safeStorageService.has(ChangedService.STORAGE_LAST_VISIT)) {
      return new Date(this.safeStorageService.get(ChangedService.STORAGE_LAST_VISIT));
    }

    return undefined;
  }

  /**
   * Save the last visit date to the local storage service.
   * @param date
   */
  saveLastVisitDate(date?: Date) {
    try {
      date = date ?? new Date();
      this.safeStorageService.save(ChangedService.STORAGE_LAST_VISIT, date);
    } catch (e) {
      // Do nothing
    }
  }
}
