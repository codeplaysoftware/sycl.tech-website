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

import { EventModel } from '../../../../../shared/models/event.model';

/**
 * Calendar item mode, wraps an event.
 */
export class CalendarItemModel {
  static id = 0;
  public id: number = 0;

  /**
   * Constructor.
   * @param event
   * @param offset
   * @param isPadding
   */
  constructor(
    public event: EventModel,
    public offset: number = 0,
    public isPadding: boolean = false
  ) {
    this.id = CalendarItemModel.id ++;
  }

  /**
   * Checks if the event starts on the given date.
   * @param date
   */
  startsOnDate(date: Date): boolean {
    return this.event.starts.toDateString() === date.toDateString();
  }

  /**
   * Checks if an event occurs on a given date.
   * @param calendarItem
   * @param date
   */
  static isOnDate(calendarItem: CalendarItemModel, date: Date) {
    if (calendarItem.event.starts.toDateString() === calendarItem.event.ends.toDateString()
      && calendarItem.event.starts.toDateString() === date.toDateString()) {
      return true;
    }

    if (date.toDateString() === calendarItem.event.starts.toDateString()) {
      return true;
    }

    if (date.toDateString() === calendarItem.event.ends.toDateString()) {
      return true;
    }

    return date >= calendarItem.event.starts && date <= calendarItem.event.ends;
  }

  /**
   * Return a list of events that occur on a given date.
   * @param date
   * @param calendarItems
   */
  static getEventsOnDate(date: Date, calendarItems: CalendarItemModel[]) {
    return calendarItems.filter(
      (calendarItem) => this.isOnDate(calendarItem, date));
  }
}
