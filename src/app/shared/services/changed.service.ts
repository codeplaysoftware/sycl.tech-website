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
import { ProjectService } from './models/project.service';
import { NewsService } from './models/news.service';
import { ResearchService } from './models/research.service';
import { VideosService } from './models/videos.service';
import { EventService } from './models/event.service';
import { map, Observable } from 'rxjs';
import { JsonFeedService } from './json-feed.service';
import { NewsModel } from '../models/news.model';

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
   * Constructor
   * @param safeStorageService
   * @param eventService
   * @param newsService
   * @param projectService
   * @param researchService
   * @param videosService
   */
  constructor(
    protected safeStorageService: SafeStorageService,
    protected eventService: EventService,
    protected newsService: NewsService,
    protected projectService: ProjectService,
    protected researchService : ResearchService,
    protected videosService: VideosService,
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

  /**
   * Get changed events.
   * @param startDate
   * @param limit
   */
  events(startDate: Date, limit: number = 50): Observable<NewsModel[]> {
    return ChangedService.filterByDate(this.eventService, startDate, limit);
  }

  /**
   * Get changed news.
   * @param startDate
   * @param limit
   */
  news(startDate: Date, limit: number = 50): Observable<NewsModel[]> {
    return ChangedService.filterByDate(this.newsService, startDate, limit);
  }

  /**
   * Get changed projects.
   * @param startDate
   * @param limit
   */
  projects(startDate: Date, limit: number = 50): Observable<NewsModel[]> {
    return ChangedService.filterByDate(this.projectService, startDate, limit);
  }

  /**
   * Get changed research.
   * @param startDate
   * @param limit
   */
  research(startDate: Date, limit: number = 50): Observable<NewsModel[]> {
    return ChangedService.filterByDate(this.researchService, startDate, limit);
  }

  /**
   * Get changed videos.
   * @param startDate
   * @param limit
   */
  videos(startDate: Date, limit: number = 50): Observable<NewsModel[]> {
    return ChangedService.filterByDate(this.videosService, startDate, limit);
  }

  /**
   * Filter the service, return items after a specific date.
   * @param service
   * @param startDate
   * @param limit
   */
  static filterByDate(
    service: JsonFeedService,
    startDate: Date,
    limit: number
  ) {
    return service.all(limit, 0, [])
      .pipe(
        map((items) => {
          return startDate ? items.filter((item) => (item.date >= startDate)) : items;
        })
      );
  }
}
