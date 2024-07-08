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

import { LoadingState } from '../../LoadingState';
import { ToggleButton } from '../toggle/toggle.component';
import { FilterGroup, ResultFilter } from '../../managers/ResultFilterManager';
import { IFilterableService } from './FilterableService';
import { Injectable, OnInit, signal, WritableSignal } from '@angular/core';
import { take, tap } from 'rxjs';

/**
 * Filterable base component provides common functionality to allow filtering, searching and rendering of
 * results.
 */
@Injectable()
export abstract class FilterableBaseComponent implements OnInit {
  /**
   * Loading state signal, used to determine if items are being fetched from the backend.
   * @protected
   */
  protected state: WritableSignal<LoadingState> = signal(LoadingState.NOT_STARTED);

  /**
   * List of all available filters groups.
   * @protected
   */
  protected filtersGroups: WritableSignal<FilterGroup[]> = signal([]);

  /**
   * List of the visible filtered results that are in view.
   * @protected
   */
  protected visibleResults: WritableSignal<any[]> = signal([]);

  /**
   * Grid view.
   * @protected
   */
  protected gridView: WritableSignal<boolean> = signal(true);

  /**
   * Number of total items for the given model type.
   * @protected
   */
  protected totalItemCount = 0;

  /**
   * Number of items, after filtering, of the given model type.
   * @protected
   */
  protected filteredItemCount: number = 0;

  /**
   * Number of items currently in view.
   * @protected
   */
  protected visibleItemCount: number = 0;

  /**
   * Number of items to load on initial load and on "view more" pressed.
   * @protected
   */
  protected maxResultsPerPage = 21;

  /**
   * The current number of results to display.
   * @protected
   */
  protected currentResultsPerPage: WritableSignal<number> = signal(0);

  /**
   * Constructor.
   * @param filterableService
   * @protected
   */
  protected constructor(
    protected filterableService: IFilterableService,
  ) { }

  /**
   * Build any filters here.
   */
  protected buildFilters(filtersGroups: any) {
    this.addFilter('search', '*', '');

    const filterGroupNames = [];

    for (const filterGroup in filtersGroups) {
      filterGroupNames.push(filterGroup);
    }

    filterGroupNames.sort();

    for (const filterGroupName of filterGroupNames) {
      filtersGroups[filterGroupName].sort();

      for (const filterName of filtersGroups[filterGroupName]) {
        this.addFilter(filterGroupName, filterName, false);
      }
    }

    this.filtersGroups.set(this.filtersGroups().slice());
  }

  /**
   * @inheritDoc
   */
  ngOnInit(): void {
    this.filterableService.getFilterGroups().pipe(
      tap((filtersGroups) => this.buildFilters(filtersGroups)),
      take(1)
    ).subscribe();

    this.refresh(true);
  }

  /**
   * Add a new filter.
   * @param groupName
   * @param name
   * @param value
   * @param extras
   * @protected
   */
  protected addFilter(
    groupName: string,
    name: any,
    value: any,
    extras?: {}
  ) {
    const filter = new ResultFilter(name, value, extras);

    for (const filterGroup of this.filtersGroups()) {
      if (filterGroup.name === groupName) {
        filterGroup.filters.push(filter);
        return ;
      }
    }

    this.filtersGroups().push(new FilterGroup(groupName, [filter]));
  }

  /**
   * Add a filter group.
   * @param filterGroup
   * @protected
   */
  protected addFilterGroup(
    filterGroup: FilterGroup
  ) {
    let merged = false;
    for (const filterGroupIndex in this.filtersGroups()) {
      const currentFilterGroup = this.filtersGroups()[filterGroupIndex];

      if (currentFilterGroup.name === filterGroup.name) {
        this.filtersGroups()[filterGroupIndex] = filterGroup;
        merged = true;
      }
    }

    if (!merged) {
      this.filtersGroups().push(filterGroup);
    }
  }

  /**
   * Refreshes the project list based on the all the filters the user has chosen.
   */
  protected refresh(
    reload: boolean
  ) {
    let offset = !reload ? this.currentResultsPerPage() : 0;
    let limit = this.maxResultsPerPage;

    this.filterableService.result(limit, offset, this.getAppliedFilters())
      .pipe(
        tap((result) => {
          this.filteredItemCount = result.filteredItemCount;
          this.totalItemCount = result.totalItemCount;

          if (reload) {
            this.visibleResults.set(result.items);
          } else {
            this.visibleResults.set(this.visibleResults().concat(result.items));
          }

          this.visibleItemCount = this.visibleResults().length;
          this.state.set(LoadingState.LOAD_SUCCESS);
        }),
        take(1)
      ).subscribe();
  }

  /**
   * Get the applied filters.
   * @protected
   */
  protected getAppliedFilters(): FilterGroup[] {
    return this.filtersGroups();
  }

  /**
   * Called by user to toggle layout.
   * @param toggleButton
   */
  protected onViewToggleChanged(
    toggleButton: ToggleButton
  ) {
    this.gridView.set(!(toggleButton.selected && 'list' === toggleButton.value));
  }

  /**
   * Called when the filters have changed.
   */
  onFiltersGroupsChanged() {
    this.refresh(true);
  }

  /**
   * Called by user to show more results.
   */
  protected onViewMore() {
    this.currentResultsPerPage.set(this.currentResultsPerPage() + this.maxResultsPerPage);
    this.refresh(false);
  }
}
