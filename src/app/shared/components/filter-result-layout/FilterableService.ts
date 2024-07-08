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

import { FilterGroup } from "../../managers/ResultFilterManager";
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
   * @param filterGroups
   */
  all(
    limit: number,
    offset: number,
    filterGroups: FilterGroup[]
  ): Observable<any[]>;

  /**
   * Return a filter result.
   * @param limit
   * @param offset
   * @param filterGroups
   */
  result<T>(
    limit: number,
    offset: number,
    filterGroups: FilterGroup[]
  ): Observable<FilterResult<T>>;

  /**
   * Count the total number of items provided by this service.
   */
  count(): Observable<number>;

  /**
   * Return a list of filters, provided by this service.
   */
  getFilterGroups(): Observable<{}>;
}
