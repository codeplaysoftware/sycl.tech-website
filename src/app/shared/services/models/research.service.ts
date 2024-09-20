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
import { ResearchModel } from '../../models/research.model';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResearchService extends JsonFeedService {
  /**
   * Constructor.
   * @param contributorService
   */
  constructor(
    protected contributorService: ContributorService
  ) {
    super(environment.json_feed_base_url + '/research_papers/');
  }

  /**
   * @inheritDoc
   */
  convertFeedItem<ResearchModel>(
    feedItem: any
  ): ResearchModel {
    const publishedDate = new Date(feedItem['date_published']);

    return <ResearchModel> {
      id: feedItem['id'],
      date: publishedDate,
      year: publishedDate.getFullYear(),
      title: feedItem['title'],
      url: feedItem['external_url'],
      description: feedItem['summary'],
      tags: feedItem['tags'] ? feedItem['tags'] : [],
      contributor: of(ContributorService.convertFeedItem(
        feedItem['author'])),
      authors: feedItem['_authors']
    }
  }

  /**
   * @inheritDoc
   */
  all(
    limit: number | null = null,
    offset: number = 0,
    filterGroups: FilterGroup[] = [],
  ): Observable<ResearchModel[]> {
    return super._all<ResearchModel>(limit, offset, filterGroups).pipe(
      map((f => f.items))
    );
  }

  /**
   * Get a random research paper.
   */
  getRandomResearchPaper(): Observable<ResearchModel> {
    return this.all().pipe(
      map((items) => items[Math.floor(Math.random() * items.length)])
    );
  }
}
