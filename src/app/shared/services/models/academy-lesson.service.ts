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
import { LessonModel } from '../../models/lesson.model';
import { JsonFeedService } from '../json-feed.service';
import { map, Observable } from 'rxjs';
import { FeedFilter } from '../../components/filter-result-layout/FilterableService';

@Injectable({
  providedIn: 'root'
})
export class AcademyLessonService extends JsonFeedService {
  /**
   * Constructor.
   * @param contributorService
   */
  constructor(
    protected contributorService: ContributorService,
  ) {
    super(environment.json_feed_base_url + '/academy_lessons/');
  }

  /**
   * @inheritDoc
   */
  convertFeedItem<LessonModel>(
    feedItem: any
  ): LessonModel {
    return <LessonModel> {
      id: feedItem['id'],
      number: feedItem['_number'],
      tag: feedItem['_tag'],
      exercise: feedItem['_exercise'],
      source: feedItem['_source'],
      solution: feedItem['_solution'],
      title: feedItem['title'],
      description: feedItem['summary'],
      content: feedItem['content_html'],
      github_homepage_url: feedItem['_lesson_home']
    }
  }

  /**
   * @inheritDoc
   */
  all(
    limit: number | null = null,
    offset: number = 0,
    filters: FeedFilter[] = [],
  ): Observable<LessonModel[]> {
    return super._all<LessonModel>(limit, offset, filters).pipe(
      map(lessons => lessons.items)
    );
  }

  /**
   * Get a lesson by its tag.
   * @param tag
   */
  getByTag(
    tag: string
  ): Observable<LessonModel> {
    return this.all().pipe(
      map((news) => {
        const found = news.find(news => news.tag === tag);

        if (found) {
          return found;
        }

        throw Error(`No lesson found for tag "${tag}".`);
      })
    );
  }
}
