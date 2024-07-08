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
import { ChangeDetectionStrategy, Component, signal, Signal, WritableSignal } from '@angular/core';
import { NewsModel } from '../../../shared/models/news.model';
import { NewsService } from '../../../shared/services/models/news.service';
import { DateDisplayComponent } from '../../../shared/components/date-display/date-display.component';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { ContributorAvatarComponent } from '../../../shared/components/contributor-avatar/contributor-avatar.component';
import { LoadingState } from '../../../shared/LoadingState';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { Meta, Title } from '@angular/platform-browser';
import { TagComponent } from '../../../shared/components/tag/tag.component';
import { NewsWidgetComponent, NewsWidgetLayout } from '../shared/news-widget/news-widget.component';
import { FilterGroup, ResultFilter } from '../../../shared/managers/ResultFilterManager';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'st-news',
  standalone: true,
  imports: [
    CommonModule,
    DateDisplayComponent,
    ContributorAvatarComponent,
    LoadingComponent,
    TagComponent,
    NewsWidgetComponent,
    RouterLink
  ],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewComponent {
  protected readonly news: Signal<NewsModel | undefined>;
  protected readonly similar: Signal<NewsModel[]>;
  protected readonly state: WritableSignal<LoadingState> = signal(LoadingState.LOADING);

  protected readonly LoadingState = LoadingState;
  protected readonly NewsWidgetLayout = NewsWidgetLayout;

  /**
   * Constructor.
   * @param newsService
   * @param activatedRoute
   * @param titleService
   * @param router
   * @param meta
   */
  constructor(
    protected newsService: NewsService,
    protected activatedRoute: ActivatedRoute,
    protected titleService: Title,
    protected router: Router,
    protected meta: Meta
  ) {
    this.news = toSignal(this.activatedRoute.params.pipe(
      switchMap(params => {
        return this.loadNewsItem(this.getFullTagFromParams(params));
      })
    ));

    this.similar = toSignal(toObservable(this.news).pipe(
      switchMap(news => news ? this.newsService.getSimilar(news, 3) : []),
    ), { initialValue: [] });
  }

  /**
   * Generate a full tag from router params.
   * @param params
   */
  protected getFullTagFromParams(params: Params) {
    const year = params['year'];
    const month = params['month'];
    const day = params['day'];
    const tag = params['tag'];

    if (year && month && day && tag) {
      return year + '-' + month + '-' + day + '-' + tag;
    }

    return '';
  }

  /**
   * Load a news item.
   * @param newsTag
   */
  protected loadNewsItem(newsTag: string): Observable<NewsModel> {
    this.state.set(LoadingState.LOADING);

    return this.newsService.getByTag(newsTag).pipe(
      tap((newsItem) => {
        this.titleService.setTitle(newsItem.title + ' - News - SYCL.tech');
        this.meta.addTag({ name: 'keywords', content: newsItem.tags.join(', ') });
        this.meta.addTag({ name: 'description', content: newsItem.description });

        this.state.set(LoadingState.LOAD_SUCCESS);
      }),
      catchError(() => {
        this.router.navigateByUrl('/news');
        return of();
      })
    );
  }

  /**
   * Called when a user clicks a tag.
   */
  protected onTagClicked(tag: string) {
    const filterGroup = new FilterGroup('tags', [
      new ResultFilter(tag, true)
    ]);

    const serializedFilters = encodeURIComponent(
      FilterGroup.groupsToJson([filterGroup]));

    this.router.navigateByUrl(`/news?filters=${serializedFilters}`)
      .then(() => {});
  }
}
