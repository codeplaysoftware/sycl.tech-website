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

import { Observable } from 'rxjs';

/**
 * A filtered result.
 */
export interface FilterResult<T> {
  items: T[];
  resultCount: number
  filteredItemCount: number
  totalItemCount: number
}

/**
 * Classes that implement this service allow filtering, counting and fetching of collection items.
 */
export interface IFilterableService {
  /**
   * Get all items provided by this service.
   * @param limit
   * @param offset
   * @param filters
   */
  all(
    limit: number,
    offset: number,
    filters: FeedFilter[]
  ): Observable<any[]>;

  /**
   * Return a filter result.
   * @param limit
   * @param offset
   * @param filters
   */
  result<T>(
    limit: number,
    offset: number,
    filters: FeedFilter[]
  ): Observable<FilterResult<T>>;

  /**
   * Count the total number of items provided by this service.
   */
  count(): Observable<number>;

  /**
   * Return a list of FeedFilter's, provided by this service.
   */
  getFilters(): Observable<FeedFilter[]>;
}

/**
 * A FeedFilter allows the simply filtering of JsonFeedService.
 */
export abstract class FeedFilter {
  /**
   * Constructor.
   * @param propertyName
   */
  protected constructor(
    public propertyName: string = '*'
  ) { }

  /**
   * Determine if the filter is valid or not.
   */
  abstract get valid(): boolean;

  /**
   * Get the value for the filter.
   */
  abstract get value(): any;

  /**
   * Inject values into this feed filter.
   * @param values
   */
  abstract inject(values: any): void;

  /**
   * Guess type!
   * https://stackoverflow.com/a/28475765
   * @param instance
   */
  static getType(instance: any) {
    return {}.toString.call(instance).split(' ')[1].slice(0, -1).toLowerCase();
  }
}

/**
 * Represents a single value that a property value must match.
 */
export class FeedPropertyFilter extends FeedFilter {
  /**
   * Constructor.
   * @param propertyName
   * @param searchString
   */
  constructor(
    propertyName: string = '*',
    public searchString: string = ''
  ) {
    super(propertyName);
    this.inject(searchString);
  }

  /**
   * @inheritdoc
   */
  get valid(): boolean {
    return this.searchString.length > 0;
  }

  /**
   * @inheritdoc
   */
  get value(): string {
    return this.searchString;
  }

  /**
   * @inheritdoc
   */
  inject(values: any) {
    this.searchString = values.toString();
  }
}

/**
 * Represents an array of items that the property value must match.
 */
export class FeedPropertyGroupFilter extends FeedFilter {
  public requiredValues: any[] = []

  /**
   * Constructor.
   * @param propertyName
   * @param requiredValues
   */
  constructor(
    propertyName: string,
    requiredValues?: any
  ) {
    super(propertyName);

    if (requiredValues) {
      this.inject(requiredValues);
    }
  }

  /**
   * @inheritdoc
   */
  get valid(): boolean {
    return this.requiredValues.length > 0;
  }

  /**
   * @inheritdoc
   */
  get value(): any[] {
    return this.requiredValues;
  }

  /**
   * @inheritdoc
   */
  inject(values: any) {
    if (!Array.isArray(values)) {
      values = [values];
    }

    this.requiredValues = this.requiredValues.concat(values);
  }
}
