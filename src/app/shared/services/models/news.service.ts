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
import { environment } from '../../../../environments/environment';
import { ContributorService } from './contributor.service';
import { FilterGroup, ResultFilter } from '../../managers/ResultFilterManager';
import { NewsModel } from '../../models/news.model';
import { JsonFeedService } from '../json-feed.service';
import { map, Observable, of } from 'rxjs';
import { PinnedModel } from '../../models/pinned.model';

@Injectable({
  providedIn: 'root'
})
export class NewsService extends JsonFeedService {
  /**
   * Constructor.
   * @param contributorService
   */
  constructor(
    protected contributorService: ContributorService
  ) {
    super(environment.json_feed_base_url + '/news/');
  }

  /**
   * @inheritDoc
   */
  convertFeedItem<NewsModel>(
    feedItem: any,
  ): NewsModel {
    return <NewsModel> {
      id: feedItem['id'],
      date: new Date(feedItem['date_published']),
      externalUrl: feedItem['external_url'],
      title: feedItem['title'],
      body: feedItem['content_html'],
      description: feedItem['summary'],
      thumbnail: feedItem['image']
        ? feedItem['image']
        : './assets/images/ecosystem/news/thumbnail-placeholder.webp',
      contributor: of(ContributorService.convertFeedItem(
        feedItem['author'])),
      tag: feedItem['_tag'],
      permalink: NewsService.getPermalink(feedItem['_tag']),
      pinned: !!feedItem['_pinned'],
      tags: feedItem['tags'] !== undefined ? feedItem['tags'] : []
    }
  }

  /**
   * Get pinned news items.
   */
  getPinned(): Observable<PinnedModel[]> {
    return this.all().pipe(
      map((items) => {
        return items.filter((item) => item.pinned).map((newsItem) => {
          return {
            title: newsItem.title,
            thumbnail: newsItem.thumbnail,
            link: newsItem.permalink,
            description: newsItem.description
          }
        })
      })
    );
  }

  /**
   * Get similar news items to a given post.
   * @param to
   * @param limit
   */
  getSimilar(
    to: NewsModel,
    limit: number
  ): Observable<NewsModel[]> {
    const resultFilters = to.tags.map((tag) => {
      return new ResultFilter(tag, true)
    });

    // + 1 for limit as the result list will always contain the "to".
    return this.all(limit + 1, 0, [new FilterGroup('tags', resultFilters)]).pipe(
      map((newItems) => {
        return newItems.filter((newItem) => to.id !== newItem.id);
      })
    );
  }

  /**
   * Get a news item by tag.
   * @param tag
   */
  getByTag(
    tag: string
  ): Observable<NewsModel> {
    return this.all().pipe(
      map((news) => {
        const found = news.find(news => news.tag === tag);

        if (!found) {
          throw Error('NO NEWS');
        }

        return found;
      })
    );
  }

  /**
   * Get a permalink to a news item.
   * @param tag
   */
  static getPermalink(
    tag: string
  ) {
    const parts = tag.split('-');
    const pathParts = parts
      .slice(0, 4 - 1)
      .concat([parts.slice(4 - 1).join('-')]);

    return '/news/' + pathParts[0] + '/' + pathParts[1] + '/' + pathParts[2] + '/' + pathParts[3];
  }

  /**
   * @inheritDoc
   */
  all(
    limit: number | null = null,
    offset: number = 0,
    filterGroups: FilterGroup[] = [],
  ): Observable<NewsModel[]> {
    return super._all<NewsModel>(limit, offset, filterGroups).pipe(map((f => f.items)));
  }
}
