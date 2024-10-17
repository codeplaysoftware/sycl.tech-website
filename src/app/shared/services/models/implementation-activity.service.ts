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
import { ImplementationActivityModel, ImplementationActivityType } from '../../models/implementation-activity.model';
import { JsonFeedService } from '../json-feed.service';
import { map, Observable } from 'rxjs';
import { FeedFilter } from '../../components/filter-result-layout/FilterableService';

@Injectable({
  providedIn: 'root'
})
export class ImplementationActivityService extends JsonFeedService {
  /**
   * Constructor.
   * @param contributorService
   */
  constructor(
    protected contributorService: ContributorService
  ) {
    super(environment.json_feed_base_url + '/implementation_activity/');
  }

  /**
   * @inheritDoc
   */
  convertFeedItem<CommunityUpdateModel>(
    feedItem: any,
  ): CommunityUpdateModel {
    return <CommunityUpdateModel> {
      title: feedItem['title'],
      type: feedItem['_type'] === 'commit'
        ? ImplementationActivityType.COMMIT
        : ImplementationActivityType.RELEASE,
      contributor: {
        username: feedItem['author']['name'],
        fullName: feedItem['author']['name'],
        avatar: feedItem['author']['avatar'],
        position: 'Unknown',
        socials: [feedItem['author']['url']],
        bio: 'No bio.',
      },
      url: feedItem['url'],
      date: feedItem['date_published'],
    }
  }

  /**
   * @inheritDoc
   */
  all(
    limit: number | null = null,
    offset: number = 0,
    filters: FeedFilter[] = [],
  ): Observable<ImplementationActivityModel[]> {
    return super._all<ImplementationActivityModel>(limit, offset, filters).pipe(map((f => f.items)));
  }
}
