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
import { inject, Injectable } from '@angular/core';
import {
  FeedFilter,
  FeedPropertyFilter, FeedPropertyGroupFilter,
  FilterResult,
  IFilterableService
} from '../components/filter-result-layout/FilterableService';

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
    filters: FeedFilter[]
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
  getFilters(): Observable<FeedFilter[]> {
    return this.fetchFeed(0).pipe(map((feed: any) => {
      const filters: FeedFilter[] = [new FeedPropertyFilter()];

      for (const filterGroupName in feed._filters) {
        const filterGroup = new FeedPropertyGroupFilter(filterGroupName);
        filterGroup.inject(feed._filters[filterGroupName]);
        filters.push(filterGroup);
      }

      return filters;
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
    filters: FeedFilter[]
  ): Observable<FilterResult<any>> {
    return this._all<T>(limit, offset, filters);
  }

  /**
   * @inheritDoc
   */
  protected _all<T>(
    limit: number | null = null,
    offset: number = 0,
    filters: FeedFilter[]
  ): Observable<FilterResult<T>> {
    return this.fetch<T>(limit, offset, filters).pipe(
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
    filtersGroups?: FeedFilter[]
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
   * Return a list of instances that pass all the enabled filters.
   * @param unfiltered
   * @param filters
   * @protected
   */
  protected filter<T>(
    unfiltered: T[],
    filters: FeedFilter[] = [],
  ): T[] {
    // Just get the enabled filters
    filters = filters.filter((filter) => filter.valid);

    return unfiltered.filter(
      (unfilteredObject) => {
        for (const filter of filters) {
          if (!this.matches(unfilteredObject, filter)) {
            // Filter does not match, escape
            return undefined;
          }
        }

        return unfilteredObject;
      }
    );
  }

  /**
   * Check if an instance matches the provided filter.
   * @param instance
   * @param filter
   */
  matches(
    instance: any,
    filter: FeedFilter
  ): boolean {
    // Match any property value
    if (filter instanceof FeedPropertyFilter && filter.propertyName == '*') {
      if (!Object.values(instance).toString().toLowerCase().includes(filter.value.toLowerCase())) {
        return false;
      }
    }
    // Match specific property value
    else if (filter instanceof FeedPropertyFilter && filter.propertyName != '*') {
      if (instance[filter.propertyName].toString().toLowerCase().includes(filter.value.toLowerCase())) {
        return false;
      }
    }
    else if (filter instanceof FeedPropertyGroupFilter && filter.propertyName != '*') {
      const filterGroup: FeedPropertyGroupFilter = filter as FeedPropertyGroupFilter;
      const objectProperty = instance[filter.propertyName];

      switch (FeedFilter.getType(objectProperty)) {
        // Handle array type
        case 'array': {
          if (!filterGroup.requiredValues.every(
            (item: string) => objectProperty.includes(item))) {
            return false;
          }

          break;
        }
        default: {
          if (!objectProperty.toString().toLowerCase().includes(filter.value)) {
            return false;
          }
        }
      }
    } else {
      console.error('NOT SUPPORTED');
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
}

/**
 * JsonFeed interface. All responses from the backend should use this format.
 */
export interface JsonFeed {
  readonly version: string
  readonly title: string
  readonly home_page_url: string
  readonly feed_url: string
  readonly _total_items: number
  readonly _total_pages: number
  readonly _items_on_page: number
  readonly items: any[]
  readonly next_url?: string
  readonly _filters: {string: []}
}

/**
 * Result wrapper.
 */
export interface FeedResult<T> {
  readonly items: T[]
  readonly resultCount: number
  readonly filteredItemCount: number
  readonly totalItemCount: number
}
