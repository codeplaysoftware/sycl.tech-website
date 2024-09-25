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
import { JsonFeedService } from '../json-feed.service';
import { FilterGroup } from '../../managers/ResultFilterManager';
import { VideoModel } from '../../models/video.model';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideosService extends JsonFeedService {
  /**
   * Constructor.
   * @param contributorService
   */
  constructor(
    protected contributorService: ContributorService,
  ) {
    super(environment.json_feed_base_url + '/videos/');
  }

  /**
   * @inheritDoc
   */
  convertFeedItem<VideoModel>(
    feedItem: any
  ): VideoModel {
    const date = new Date(feedItem['date_published']);

    return <VideoModel> {
      id: feedItem['id'],
      title: feedItem['title'],
      date: date,
      year: date.getFullYear(),
      url: feedItem['external_url'],
      thumbnail: feedItem['image'] ? feedItem['image'] : undefined,
      description: feedItem['summary'],
      contributor: of(ContributorService.convertFeedItem(
        feedItem['author'])),
      type: feedItem['_type'],
      featuring: feedItem['_featuring'],
      tags: feedItem['tags'] ? feedItem['tags'] : [],
      embedUrl: VideosService.generateEmbedUrl(feedItem['external_url'])
    }
  }

  /**
   * @inheritDoc
   */
  all(
    limit: number | null = null,
    offset: number = 0,
    filterGroups: FilterGroup[] = [],
  ): Observable<VideoModel[]> {
    return super._all<VideoModel>(limit, offset, filterGroups).pipe(map((f => f.items)));
  }

  /**
   * Get a random video.
   */
  getRandomVideo(): Observable<VideoModel> {
    return this.all().pipe(
      map((items) => {
        return items[Math.floor(Math.random() * items.length)];
      })
    );
  }

  /**
   * Get all video items after a specific date.
   * @param startDate
   * @param limit
   */
  afterDate(
    startDate: Date,
    limit: number | null = null
  ): Observable<VideoModel[]> {
    return this.all(limit)
      .pipe(
        map((items) => {
          return startDate ? items.filter((item) => (item.date >= startDate)) : items;
        })
      );
  }

  /**
   * Attempt to generate an embed URL based on the external provider.
   * @param externalUrl
   */
  static generateEmbedUrl(externalUrl: string): string | undefined {
    const url = new URL(externalUrl);
    let embedUrl = undefined;

    // Handle YouTube
    if (url.hostname.replace('www.', '') == 'youtube.com') {
      embedUrl = externalUrl.replace('watch?v=', 'embed/');
      return embedUrl.replace('youtube.com', 'youtube-nocookie.com');
    }

    return undefined;
  }
}
