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

import { forkJoin, map, mergeMap, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FilterGroup, ResultFilter } from '../managers/ResultFilterManager';
import { inject, Injectable } from '@angular/core';
import { FilterResult, IFilterableService } from '../components/filter-result-layout/FilterableService';

/**
 * Base class for all json based services.
 */
@Injectable({
  providedIn: 'root'
})
export abstract class JsonFeedService implements IFilterableService {
  protected httpClient = inject(HttpClient);

  /**
  * Constructor.
  */
  protected constructor(
    protected feedBaseUrl: string
  ) { }

  /**
   * @inheritDoc
   */
  abstract all(
    limit: number,
    offset: number,
    filterGroups: FilterGroup[]
  ): Observable<any[]>;

  /**
   * @inheritDoc
   */
  count(): Observable<number> {
    return this.fetchFeed(0).pipe(map((feed) => {
      return feed._total_items;
    }));
  }

  /**
   * @inheritDoc
   */
  getFilterGroups(): Observable<{}> {
    return this.fetchFeed(0).pipe(map((feed) => {
      return feed._filters;
    }));
  }

  /**
   * Count how many feed pages are present.
   */
  countFeedPages(): Observable<number> {
    return this.fetchFeed(0).pipe(map((feed) => {
      return feed._total_pages;
    }));
  }

  /**
   * @inheritDoc
   */
  result<T>(
    limit: number,
    offset: number,
    filterGroups: FilterGroup[]
  ): Observable<FilterResult<any>> {
    return this._all<T>(limit, offset, filterGroups);
  }

  /**
   * @inheritDoc
   */
  protected _all<T>(
    limit: number | null = null,
    offset: number = 0,
    filterGroups: FilterGroup[] = [],
  ): Observable<FilterResult<T>> {
    return this.fetch<T>(limit, offset, filterGroups).pipe(
      map((result) => {
        return JsonFeedService.remapFeedResult<T>(result);
      })
    );
  }

  /**
   * Convert a JSON feed item into an actual model.
   * @param feedItem
   */
  abstract convertFeedItem<T>(
    feedItem: any
  ): T;

  /**
   * @param limit
   * @param offset
   * @param filtersGroups
   */
  fetch<T>(
    limit: number | null = null,
    offset: number = 0,
    filtersGroups?: FilterGroup[]
  ): Observable<FeedResult<T>> {
    let totalItemCount = 0;
    let filteredItemCount = 0;

    return this.countFeedPages().pipe(
      mergeMap((totalFeedPages) => {
        const requests = [];

        for (let pageNumber = 0; pageNumber < totalFeedPages; pageNumber++) {
          requests.push(this.fetchFeed(pageNumber));
        }

        return forkJoin(requests)
          .pipe(
            tap(requests =>
              totalItemCount = requests[0]._total_items),
            map(requests =>
              requests.reduce((accumulator, feed) => accumulator.concat(feed.items), <T[]>[])),
            map(feedItems =>
              feedItems.map(feedItem => this.convertFeedItem<T>(feedItem))),
            map(feedItems =>
              filtersGroups ? this.filter<T>(feedItems, filtersGroups) : feedItems),
            tap(feedItems =>
              filteredItemCount = feedItems.length),
            map(feedItems =>
              limit ? feedItems.slice(offset, limit + offset) : feedItems.slice(offset)),
            map(convertedFeedItems =>
              <FeedResult<T>> {
                items: convertedFeedItems,
                totalItemCount: totalItemCount,
                filteredItemCount: filteredItemCount,
                resultCount: convertedFeedItems.length,
              }),
          )
      })
    );
  }

  /**
   * @param page
   */
  fetchFeed(
    page: number = 0
  ): Observable<JsonFeed> {
    return this.httpClient.get<JsonFeed>(
      JsonFeedService.buildFeedUrl(this.feedBaseUrl, page), { responseType: 'json' });
  }

  /**
   * @param unfiltered
   * @param filterGroups
   * @protected
   */
  protected filter<T>(
    unfiltered: T[],
    filterGroups: FilterGroup[] = [],
  ): T[] {
    let filtered: any[] = unfiltered;

    for (const filterGroup of filterGroups) {
      if (!filterGroup.isValid()) {
        continue;
      }

      const currentResultGroup: any[] = [];
      filterGroup.getValid().forEach((filter) => {
        unfiltered.forEach((object) => {
          if (this.matches(object, filterGroup.name.toLowerCase(), filter)) {
            currentResultGroup.push(object);
          }
        });
      });

      filtered = filtered.filter(o => currentResultGroup.includes(o));
    }

    return filtered.filter(x => x);
  }

  /**
   * Check if a filter matches an instance.
   * @param instance
   * @param propertyName
   * @param filter
   */
  matches(
    instance: any,
    propertyName: string,
    filter: ResultFilter
  ): boolean {
    for (const objectKey of Object.keys(<Object> instance)) {
      if (filter.name == '*' && !JsonFeedService.similar(instance, filter.getRealValue())) {
        return false;
      } else if (propertyName === objectKey) {
        if (!JsonFeedService.similar(instance[objectKey], filter.getRealValue())) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Generate a proper target feed URL using a base URL and a page number.
   * @param baseUrl
   * @param page
   */
  static buildFeedUrl(
    baseUrl: string,
    page: number
  ): string {
    let pageName = 'feed.json';

    if (page > 0) {
      pageName = page + '.json';
    }

    return baseUrl + pageName;
  }

  /**
   * @param jsonResult
   * @protected
   */
  static remapFeedResult<T>(
    jsonResult: FeedResult<T>
  ): FilterResult<T> {
    return {
      items: jsonResult.items,
      resultCount: jsonResult.resultCount,
      filteredItemCount: jsonResult.filteredItemCount,
      totalItemCount: jsonResult.totalItemCount
    }
  }

  /**
   * Check if one value is similar to another value. Quick a nasty function but should work for most cases in a
   * fuzzy way.
   * @param value1
   * @param value2
   */
  static similar(
    value1: any,
    value2: any
  ): boolean {
    if (value1 === value2) {
      return true;
    }

    if (typeof value1 == 'object') {
      value1 = JSON.stringify(value1);
    }

    if (typeof value2 == 'object') {
      value2 = JSON.stringify(value2);
    }

    if (value1 == undefined || value2 == undefined) {
      return false;
    }

    value1 = value1.toString().toLowerCase();
    value2 = value2.toString().toLowerCase();

    if (value1.length == 0 || value2.length == 0) {
      return false;
    }

    return value1.includes(value2) || value2.includes(value1);
  }
}

/**
 * JsonFeed interface. All responses from the backend should use this format.
 */
export interface JsonFeed {
  version: string
  title: string
  home_page_url: string
  feed_url: string
  _total_items: number
  _total_pages: number
  _items_on_page: number
  items: any[]
  next_url?: string
  _filters: {string: []}
}

/**
 * Result wrapper.
 */
export interface FeedResult<T> {
  items: T[]
  resultCount: number
  filteredItemCount: number
  totalItemCount: number
}
