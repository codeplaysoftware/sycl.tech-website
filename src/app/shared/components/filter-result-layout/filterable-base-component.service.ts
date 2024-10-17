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
import { IFilterableService } from './FilterableService';
import { inject, Injectable, OnInit, signal, WritableSignal } from '@angular/core';
import { take, tap } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FilterManager, UIFilter } from './FilterManager';

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
  protected filters: WritableSignal<UIFilter[]> = signal([]);

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

  protected router: Router = inject(Router);
  protected activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  protected queryParams?: Params

  /**
   * Constructor.
   * @param filterableService
   * @protected
   */
  protected constructor(
    protected filterableService: IFilterableService
  ) { }

  /**
   * @inheritDoc
   */
  ngOnInit(): void {
    this.filterableService.getFilters().pipe(
      tap((filters) => {
        this.filters.set(FilterManager.convertFromFeedFilters(filters));

        // Handle paging
        this.activatedRoute.queryParams.subscribe((queryParams) => {
          this.queryParams = queryParams;

          FilterManager.mergeFiltersAndParams(this.filters(), queryParams);

          if (queryParams['page'] !== undefined) {
            let page = Number.parseInt(queryParams['page']);

            if (page < 1) {
              page = 1;
            }

            this.currentResultsPerPage.set(this.maxResultsPerPage * (page - 1));
          }

          this.refresh(true);
        });
      })
    ).subscribe();
  }

  /**
   * Refreshes the project list based on the all the filters the user has chosen.
   */
  protected refresh(
    reload: boolean
  ) {
    let offset = !reload ? this.currentResultsPerPage() : 0;
    let limit = this.maxResultsPerPage;

    const feedFilters = FilterManager.convertFiltersToFeedFilters(this.filters(), this.queryParams);

    this.filterableService.result(limit, offset, feedFilters)
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
  onFiltersChanged() {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: FilterManager.convertFiltersToParams(this.filters())
    }).then();
  }

  /**
   * Called by user to show more results.
   */
  protected onViewMore() {
    this.currentResultsPerPage.set(this.currentResultsPerPage() + this.maxResultsPerPage);
    this.refresh(false);
  }
}
