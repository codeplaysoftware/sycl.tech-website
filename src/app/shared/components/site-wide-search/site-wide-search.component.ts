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

import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Signal, signal, ViewChild, WritableSignal } from '@angular/core';
import { SearchComponent } from '../search/search.component';
import { Router } from '@angular/router';
import { SearchFilters, SearchResult, SearchService } from '../../services/models/search.service';
import { debounceTime, Subject, switchMap, tap } from 'rxjs';
import { LoadingComponent } from '../loading/loading.component';
import { TagComponent } from '../tag/tag.component';
import { PopupReference } from '../popup/PopupService';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'st-site-wide-search',
  standalone: true,
  imports: [
    CommonModule,
    SearchComponent,
    LoadingComponent,
    TagComponent,
    TruncatePipe,
    NgOptimizedImage
  ],
  templateUrl: './site-wide-search.component.html',
  styleUrl: './site-wide-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SiteWideSearchComponent {
  // Internal state, reference for template
  protected readonly SearchState = SearchState;

  // Max results to return for a given search
  protected readonly maxResults: number = 20;

  // Search query subject
  protected readonly searchQuery$ = new Subject<string>();

  // The current search value
  protected readonly currentSearchValue: WritableSignal<string> = signal('');

  // Internal search state
  protected readonly state: WritableSignal<SearchState> = signal(SearchState.READY);

  // Results from given search
  protected resultsSignal: Signal<SearchResult[]> = signal([]);

  // Filters, used to define what results to show
  protected filters: Signal<SearchFilters> = signal({
    news: true,
    videos: true,
    research: true,
    projects: true,
    pages: true
  });

  // Reference to search input, used to auto select it on search showing
  @ViewChild('searchInput')
  protected searchElement: SearchComponent | undefined;

  /**
   * Constructor.
   * @param popupReference
   * @param searchService
   * @param router
   */
  constructor(
    @Inject('POPUP_DATA') protected popupReference: PopupReference,
    protected searchService: SearchService,
    protected router: Router
  ) {
    this.show(true);
  }

  /**
   * Show or hide the search component.
   * @param state
   */
  show(state: boolean = true) {
    if (state) {
      this.resultsSignal = toSignal(
        this.searchQuery$.pipe(
          tap(() => this.state.set(SearchState.LOADING)),
          debounceTime(500),
          tap((query) => this.currentSearchValue.set(query)),
          switchMap(query =>
            this.searchService.search(query, this.maxResults, this.filters())),
          tap((results) => {
            if (this.currentSearchValue().length > 0) {
              this.state.set(results.length > 0
                ? SearchState.LOADED_WITH_RESULTS
                : SearchState.LOADED_NO_RESULTS)
            } else {
              this.state.set(SearchState.READY)
            }
          })
      ), { initialValue: [] });

      setTimeout(() => {
        if (this.searchElement) {
          this.searchElement.focus();
        }
      });
    } else {
      this.searchQuery$.complete();
      this.popupReference.close(null);
    }
  }

  /**
   * Called when the search query input value changes.
   */
  onSearchQueryChanged(query: string) {
    this.searchQuery$.next(query);
  }

  /**
   * Called when a user presses a key on the search input.
   */
  onKeyDown(event: KeyboardEvent) {
    if (event.code == 'Enter' && this.resultsSignal().length > 0) {
      this.router.navigate([this.resultsSignal()[0].url])
        .then(() => null);

      this.show(false);
    }
  }

  /**
   * Called when a filter has been changed.
   */
  onFilterSelected() {
    this.onSearchQueryChanged(this.currentSearchValue());
  }
}

/**
 * Represents the state of the search results.
 */
enum SearchState {
  LOADING,
  LOADED_WITH_RESULTS,
  LOADED_NO_RESULTS,
  READY
}
