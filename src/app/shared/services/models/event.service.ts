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
import { environment } from '../../../../environments/environment';
import { EventModel } from '../../models/event.model';
import { ContributorService } from './contributor.service';
import { JsonFeedService } from '../json-feed.service';
import { map, Observable, of } from 'rxjs';
import { FeedFilter } from '../../components/filter-result-layout/FilterableService';

@Injectable({
  providedIn: 'root'
})
export class EventService extends JsonFeedService {
  /**
   * Constructor.
   * @param contributorService
   */
  constructor(
    protected contributorService: ContributorService
  ) {
    super(environment.json_feed_base_url + '/events/');
  }

  /**
   * @inheritDoc
   */
  convertFeedItem<EventModel>(
    feedItem: any
  ): EventModel {
    let attendees = [];

    if (feedItem['_attendees']) {
      attendees = feedItem['_attendees'].map(
        (attendee: any) => ContributorService.convertFeedItem(attendee));
    }

    return <EventModel> {
      title: feedItem['title'],
      content: feedItem['content_html'] ?? undefined,
      date: new Date(feedItem['date_published']),
      starts: new Date(feedItem['_starts']),
      ends: new Date(feedItem['_ends']),
      url: feedItem['external_url'],
      location: feedItem['_location'],
      attendees: attendees,
      contributor: of(ContributorService.convertFeedItem(
        feedItem['author'])),
    }
  }

  /**
   * @inheritDoc
   */
  all(
    limit: number | null = null,
    offset: number = 0,
    filters: FeedFilter[] = [],
  ): Observable<EventModel[]> {
    return super._all<EventModel>(limit, offset, filters).pipe(map((f => f.items)));
  }

  /**
   * Get all events within a given year and month.
   * @param year
   * @param month
   */
  getAllEventsByYearMonth(
    year: number,
    month: number
  ): Observable<EventModel[]> {
    return this.all().pipe(
      map((events) => {
        return events.filter((event) => {
          return event.starts.getFullYear() === year && event.starts.getMonth() == month ? event : null;
        })
      })
    );
  }

  /**
   * Return upcoming events.
   * @param limit
   * @param offset
   */
  getUpcomingEvents(
    limit: number | null = null,
    offset: number = 0
  ): Observable<EventModel[]> {
    const currentDateTime = new Date();

    return this.all().pipe(
      map(events => events.filter((event) => {
        return event.starts > currentDateTime ? event : null;
      })),
      map(events => events.sort((a, b) => (a.starts > b.starts) ? 1 : -1)),
      map(events => limit ? events.slice(offset, limit) : events.slice(offset))
    );
  }

  /**
   * Return a count of the number of events in the provided year.
   * @param year
   */
  getYearlyEventCount(year: number): Observable<number> {
    return this.all().pipe(
      map((events) => {
        return events.filter((event) => {
          return event.starts.getFullYear() == year ? event : null;
        }).length
      })
    );
  }
}
