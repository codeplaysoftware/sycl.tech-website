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

import { ChangeDetectionStrategy, Component, Inject, signal, Signal, WritableSignal } from '@angular/core';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { PopupReference } from '../../../shared/components/popup/popup.service';

@Component({
  selector: 'st-change-start-date',
  standalone: true,
  templateUrl: './change-start-date.component.html',
  imports: [
    NgOptimizedImage,
    DatePipe
  ],
  styleUrls: [
    '../../../shared/components/popup/layouts/large-top-header.scss',
    './change-start-date.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangeStartDateComponent {
  protected readonly noLastVisit: Signal<boolean>;
  protected readonly errorMessage: WritableSignal<string> = signal('');
  protected readonly startDate: Signal<Date>;

  /**
   * Constructor.
   * @param popupReference
   */
  constructor(
    @Inject('POPUP_DATA') protected popupReference: PopupReference,
  ) {
    if (this.popupReference.data) {
      this.noLastVisit = signal(false);
      this.startDate = signal(new Date(this.popupReference.data));
    } else {
      this.noLastVisit = signal(true);

      const dateDateTime = new Date();
      dateDateTime.setMonth(dateDateTime.getMonth() - 5);
      dateDateTime.setDate(1);

      // Set a default date, just in case we can't load one successfully
      this.startDate = signal(dateDateTime);
    }
  }

  /**
   * Called when the date selector changes.
   * @param event
   */
  onDateChanged(event: any) {
    const selectedDate: any = new Date(event.target.value);
    const currentDate = new Date();

    if (isNaN(selectedDate)) {
      this.errorMessage.set('Please ensure that the date is in a correct format.');
      return;
    }

    if (ChangeStartDateComponent.monthDifference(selectedDate, currentDate) > 6) {
      this.errorMessage.set('You cannot pick a date that is more than six months from the current date.');
      return;
    }

    if (selectedDate > currentDate) {
      this.errorMessage.set('You cannot set a date that is in the future, please choose an earlier date.');
      return;
    }

    this.popupReference.close(selectedDate);
  }

  /**
   * Called when the user clicks on the cancel button.
   */
  onClose() {
    this.popupReference.close(this.startDate());
  }

  /**
   * Calculate the month difference between two dates.
   * @param dateFrom
   * @param dateTo
   */
  public static monthDifference(dateFrom: Date, dateTo: Date): number {
    return dateTo.getMonth() - dateFrom.getMonth() +
      (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
  }
}
