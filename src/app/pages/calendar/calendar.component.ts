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

import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, OnInit, signal, WritableSignal } from '@angular/core';
import { LoadingState } from '../../shared/LoadingState';
import { SearchablePage } from '../../shared/components/site-wide-search/SearchablePage';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { EventCalendarComponent } from './shared/event-calendar/event-calendar.component';
import { HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'st-events',
  standalone: true,
  imports: [
    EventCalendarComponent
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent implements OnInit, SearchablePage {
  protected readonly LoadingState = LoadingState;
  protected readonly currentDate: WritableSignal<Date> = signal(new Date());

  /**
   * Constructor.
   * @param titleService
   * @param activatedRoute
   * @param location
   * @param meta
   */
  constructor(
    protected titleService: Title,
    protected activatedRoute: ActivatedRoute,
    protected location: Location,
    protected meta: Meta
  ) {
    this.titleService.setTitle('Calendar - SYCL.tech');
    this.meta.addTag({ name: 'keywords', content: this.getKeywords().join(', ') });
    this.meta.addTag({ name: 'description', content: this.getDescription() });

    effect(() => {
      const date = this.currentDate();

      const params = new HttpParams()
        .set('year', date.getFullYear())
        .set('month', date.getMonth() + 1);

      this.location.replaceState('/calendar', params.toString());
    })
  }

  /**
   * @inheritDoc
   */
  ngOnInit(): void {
    const year = this.activatedRoute.snapshot.queryParams['year'];
    const month = this.activatedRoute.snapshot.queryParams['month'];

    if (year && month) {
      this.currentDate().setFullYear(Number.parseInt(year));
      this.currentDate().setMonth(Number.parseInt(month) - 1);
    }
  }

  /**
   * @inheritDoc
   */
  getKeywords(): string[] {
    return ['calendar', 'events', 'conferences'];
  }


  /**
   * @inheritDoc
   */
  getTitle(): string {
    return 'Calendar';
  }

  /**
   * @inheritDoc
   */
  getDescription() {
    return 'A public calendar, for all events, conferences, webinars and more!';
  }

  /**
   * @inheritDoc
   */
  getDefaultRoutePath() {
    return '/calendar/';
  }

  protected readonly environment = environment;
}
