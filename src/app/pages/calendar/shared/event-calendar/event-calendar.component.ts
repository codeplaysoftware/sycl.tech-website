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

import { CommonModule, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, model, OnInit, signal, WritableSignal } from '@angular/core';
import { DayModel } from './models/day.model';
import { CalendarItemModel } from './models/calendar-item.model';
import { TruncatePipe } from '../../../../shared/pipes/truncate.pipe';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { EventService } from '../../../../shared/services/models/event.service';
import { ActivatedRoute } from '@angular/router';
import { PopupReference, PopupService } from '../../../../shared/components/popup/PopupService';
import { LoadingState } from '../../../../shared/LoadingState';
import { EventModel } from '../../../../shared/models/event.model';
import { EventViewerPopupComponent } from './event-viewer-popup/event-viewer-popup.component';
import { map, Observable, tap } from 'rxjs';

@Component({
  selector: 'st-event-calendar',
  standalone: true,
  imports: [
    CommonModule,
    TruncatePipe,
    LoadingComponent,
  ],
  templateUrl: './event-calendar.component.html',
  styleUrl: './event-calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventCalendarComponent implements OnInit {
  readonly currentDate = model<Date>(new Date());

  protected focusedEvent: CalendarItemModel | null = null;
  protected dayModels$: Observable<DayModel[]> | undefined;
  protected popupReference: PopupReference | undefined;

  protected readonly stateSignal: WritableSignal<LoadingState> = signal(LoadingState.NOT_STARTED);
  protected readonly todayDate: Date = new Date();
  protected readonly LoadingState = LoadingState;

  /**
   * Constructor.
   * @param eventService
   * @param activatedRoute
   * @param location
   * @param popupService
   */
  constructor(
    protected eventService: EventService,
    protected activatedRoute: ActivatedRoute,
    protected location: Location,
    protected popupService: PopupService
  ) { }

  /**
   * @inheritDoc
   */
  ngOnInit(): void {
    this.resetCalendar();
  }

  /**
   * @inheritDoc
   */
  ngOnDestroy(): void {
    this.popupReference?.close(undefined);
  }

  /**
   * Prepare the calendar for view.
   */
  resetCalendar() {
    this.stateSignal.set(LoadingState.LOADING);

    // Load calendar items from backend
    this.dayModels$ = this.eventService.getAllEventsByYearMonth(
      this.currentDate().getFullYear(), this.currentDate().getMonth())
      .pipe(
        map((events) => {
          return events.map((item: EventModel) => {
            return new CalendarItemModel(item);
          });
        }),
        map((calendarItems) => {
          calendarItems.sort(function (a, b) {
            return a.event.starts.getTime() - b.event.starts.getTime();
          });

          return calendarItems;
        }),
        map((calendarItems) => {
          return EventCalendarComponent.generateOffsets(calendarItems);
        }),
        map((calendarItems) => {
          return this.generateDayModelsWithCalendarItems(calendarItems);
        }),
        map((dayModels) => {
          return dayModels.map((dayModel) => {
            return this.injectPaddingCalendarItems(dayModel)
          })
        }),
        tap(() => this.stateSignal.set(LoadingState.LOAD_SUCCESS))
      );
  }

  /**
   * This function generate an array of day models with the number and date depending on the current month.
   * @param date
   */
  generateEmptyDaysByDate(date: Date): DayModel[] {
    const dayModels: DayModel[] = [];

    for (let day = 1; day < new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() + 1; day++) {
      dayModels.push({
        day: day,
        date: new Date(date.getFullYear(), date.getMonth(), day),
        calendarItems: []
      });
    }

    return dayModels;
  }

  /**
   * Convert an array of calendar items into an array of the months days, with calendar items assigned to each day.
   * @param calendarItems
   */
  generateDayModelsWithCalendarItems(calendarItems: CalendarItemModel[]): DayModel[] {
    const days: DayModel[] = this.generateEmptyDaysByDate(this.currentDate());

    for (const day of days) {
      for (const calendarItem of calendarItems) {
        if (CalendarItemModel.isOnDate(calendarItem, day.date)) {
          day.calendarItems.push(calendarItem);
        }
      }
    }

    return days;
  }

  /**
   * This function injects "padding" calendar items into a day's calendar items. These are needed to ensure
   * multi-day calendar events appear in the correct position on each subsequent day.
   * @param dayModel
   */
  injectPaddingCalendarItems(dayModel: DayModel): DayModel {
    dayModel.calendarItems.sort(function (a, b) {
      return a.offset - b.offset;
    });

    if (dayModel.calendarItems.length == 0) {
      return dayModel;
    }

    const firstCalendarItem = dayModel.calendarItems[0];

    if (firstCalendarItem.offset < 2) {
      return dayModel;
    }

    dayModel.calendarItems = EventCalendarComponent.createPaddingEvents(
      firstCalendarItem.event.starts, firstCalendarItem.offset - 1)
      .concat(dayModel.calendarItems);

    return dayModel;
  }

  /**
   * Called when a user clicks on a specific event.
   * @param calendarItem
   */
  onEventClick(calendarItem: CalendarItemModel) {
    this.popupReference = this.popupService.create(
      EventViewerPopupComponent, calendarItem, true);
  }

  /**
   * Determine the classes of an event item on the calendar depending on the properties of the event as well as the
   * current hover user state.
   * @param date
   * @param event
   */
  getClass(date: Date, event: CalendarItemModel) {
    let typeClass = '';
    let hoveredClass = '';

    if (this.focusedEvent && event.id === this.focusedEvent.id) {
      hoveredClass = 'hovered';
    }

    if (event.event.starts.toDateString() === event.event.ends.toDateString()) {
      typeClass = 'single';
    } else if (event.event.starts.toDateString() === date.toDateString()) {
      typeClass = 'start';
    } else if (event.event.ends.toDateString() === date.toDateString()) {
      typeClass = 'end';
    } else if (event.event.starts >= date && event.event.ends <= date) {
      typeClass = 'middle';
    }

    return [typeClass, hoveredClass];
  }

  /**
   * Handles hovering of an event on the calendar.
   * @param calendarItem
   * @param hovered
   */
  onMouseChange(calendarItem: CalendarItemModel, hovered: boolean) {
    if (hovered) {
      this.focusedEvent = calendarItem;
    } else {
      this.focusedEvent = null;
    }
  }

  /**
   * Show the next month of the calendar.
   */
  onNext(event: MouseEvent) {
    event.preventDefault();

    const currentDate = new Date(this.currentDate());
    currentDate.setMonth(currentDate.getMonth() + 1);
    this.currentDate.set(currentDate);

    this.resetCalendar();
  }

  /**
   * Show the previous month of the calendar.
   */
  onPrevious(event: MouseEvent) {
    event.preventDefault();

    const currentDate = new Date(this.currentDate());
    currentDate.setMonth(currentDate.getMonth() - 1);
    this.currentDate.set(currentDate);

    this.resetCalendar();
  }

  /**
   * Get the previous URL.
   */
  getPreviousUrl(): string {
    const nextDate = new Date(this.currentDate().getTime());
    nextDate.setMonth(nextDate.getMonth() - 1);

    return '/calendar/' + nextDate.getFullYear() + '/' + (nextDate.getMonth() + 1);
  }

  /**
   * Get the next URL.
   */
  getNextUrl(): string {
    const nextDate = new Date(this.currentDate().getTime());
    nextDate.setMonth(nextDate.getMonth() + 1);

    return '/calendar/' + nextDate.getFullYear() + '/' + (nextDate.getMonth() + 1);
  }

  /**
   * Determines of the provided date is "today".
   * @param date
   */
  isToday(date: Date): boolean {
    return date.toDateString() === this.todayDate.toDateString();
  }

  /**
   * Generate offsets for each calendar item.
   * @param calenderItems
   */
  static generateOffsets(calenderItems: CalendarItemModel[]): CalendarItemModel[] {
    for (const event of calenderItems) {
      const eventsOnDate = CalendarItemModel.getEventsOnDate(event.event.starts, calenderItems);
      event.offset = EventCalendarComponent.findNextAvailableOffset(event.event.starts, eventsOnDate);
    }

    return calenderItems;
  }

  /**
   * Attempts to find the next available offset for an event.
   * @param date
   * @param events
   * @param offset
   */
  static findNextAvailableOffset(date: Date, events: CalendarItemModel[], offset = 0): number {
    for (const event of events) {
      if (event.offset == offset) {
        return EventCalendarComponent.findNextAvailableOffset(date, events, offset + 1);
      }
    }

    return offset;
  }

  /**
   * Create a fake event use for padding.
   * @param date
   * @param numberToCreate
   */
  static createPaddingEvents(date: Date, numberToCreate: number): CalendarItemModel[] {
    const paddingEvents = [];
    const paddingEvent = new CalendarItemModel({
      ends: date,
      starts: date,
      attendees: [],
      location: '',
      title: '',
      url: '',
    });

    paddingEvent.isPadding = true;

    for (let counter = 0; counter < numberToCreate; counter++) {
      paddingEvent.offset = counter;
      paddingEvents.push(paddingEvent);
    }

    return paddingEvents;
  }
}
