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

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NewsService } from '../../shared/services/models/news.service';
import { SearchComponent } from '../../shared/components/search/search.component';
import { ShowMoreComponent } from '../../shared/components/show-more/show-more.component';
import { ToggleComponent } from '../../shared/components/toggle/toggle.component';
import { LoadingState } from '../../shared/LoadingState';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ContributorAvatarComponent } from '../../shared/components/contributor-avatar/contributor-avatar.component';
import { NewsWidgetComponent, NewsWidgetLayout } from './shared/news-widget/news-widget.component';
import { Meta, Title } from '@angular/platform-browser';
import { ContributorModel } from '../../shared/models/contributor.model';
import { ContributorService } from '../../shared/services/models/contributor.service';
import { FilterableBaseComponent } from '../../shared/components/filter-result-layout/filterable-base-component.service';
import { SearchablePage } from '../../shared/components/site-wide-search/SearchablePage';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UISearchFilter } from '../../shared/components/filter-result-layout/FilterManager';

@Component({
  selector: 'st-news',
  standalone: true,
  imports: [
    CommonModule,
    SearchComponent,
    ShowMoreComponent,
    ToggleComponent,
    LoadingComponent,
    ContributorAvatarComponent,
    NewsWidgetComponent,
  ],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsComponent extends FilterableBaseComponent implements OnInit, SearchablePage {
  protected override maxResultsPerPage = 20;

  protected page: number = 1;
  protected vips: Observable<ContributorModel[]> | undefined;

  protected readonly LoadingState = LoadingState;
  protected readonly Layout = NewsWidgetLayout;
  protected readonly environment = environment;

  /**
   * Constructor.
   * @param newsService
   * @param titleService
   * @param contributorService
   * @param meta
   */
  constructor(
    protected newsService: NewsService,
    protected titleService: Title,
    protected contributorService: ContributorService,
    protected meta: Meta
  ) {
    super(newsService);
    this.titleService.setTitle('News - SYCL.tech');
    this.meta.addTag({ name: 'keywords', content: this.getKeywords().join(', ') });
    this.meta.addTag({ name: 'description', content: this.getDescription() });
  }

  /**
   * @inheritDoc
   */
  override ngOnInit(): void {
    super.ngOnInit();
    this.vips = this.contributorService.getVips();
  }

  /**
   * @inheritDoc
   */
  protected override onViewMore() {
    super.onViewMore();
    this.page += 1;
  }

  /**
   * Get the search filter.
   */
  getSearchFilter(): UISearchFilter | undefined {
    for (const filter of this.filters()) {
      if (filter instanceof UISearchFilter) {
        return filter as UISearchFilter;
      }
    }

    return undefined;
  }

  /**
   * Get the next page url.
   */
  getNextPageUrl(): string {
    return '/news/?page=' + (this.page + 1);
  }

  /**
   * @inheritDoc
   */
  getKeywords(): string[] {
    return ['news', 'updates', 'alerts', 'latest'];
  }

  /**
   * @inheritDoc
   */
  getTitle(): string {
    return 'News';
  }

  /**
   * @inheritDoc
   */
  getDescription() {
    return 'Read the latest news, updates and announcements related to SYCL.';
  }

  /**
   * @inheritDoc
   */
  getDefaultRoutePath() {
    return '/news';
  }
}
