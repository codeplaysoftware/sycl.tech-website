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
import { ProjectModel, RepositoryModel } from '../../models/project.model';
import { FilterGroup } from '../../managers/ResultFilterManager';
import { ContributorService } from './contributor.service';
import { ContributorModel } from '../../models/contributor.model';
import { JsonFeedService } from '../json-feed.service';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends JsonFeedService {
  /**
   * Constructor.
   * @param contributorService
   */
  constructor(
    protected contributorService: ContributorService,
  ) {
    super(environment.json_feed_base_url + '/projects/');
  }

  /**
   * @inheritDoc
   */
  convertFeedItem<ProjectModel>(
    feedItem: any
  ): ProjectModel {
    let repositoryModel: RepositoryModel | null = null;

    if (feedItem['_repo_details']) {
      const repoDetails = feedItem['_repo_details'];

      repositoryModel = {
        contributors: [],
      }

      if (repoDetails['owner']) {
        repositoryModel.owner = {
          name: repoDetails['owner']['name'],
          url: repoDetails['owner']['url']
        }
      }

      if (repoDetails['contributors']) {
        repositoryModel.contributors = repoDetails['contributors'].map(
          (contributor: any) => ProjectService.createRepoContributor(
            contributor['username'],
            contributor['avatar'],
            contributor['github_url']))
      }

      if (repoDetails['stars']) {
        repositoryModel.stars = repoDetails['stars'];
      }

      if (repoDetails['clone_url']) {
        repositoryModel.cloneUrl = repoDetails['clone_url'];
      }
    }

    return <ProjectModel> {
      id: feedItem['id'],
      date_created: new Date(feedItem['date_published']),
      contributor: of(ContributorService.convertFeedItem(
        feedItem['author'])),
      year: new Date(feedItem['date_published']).getFullYear(),
      url: feedItem['external_url'],
      license: feedItem['_license'],
      name: feedItem['title'],
      description: feedItem['summary'],
      categories: feedItem['_categories'] ? feedItem['_categories'] : [],
      tags: feedItem['tags'],
      repository: repositoryModel
    };
  }

  /**
   * @inheritDoc
   */
  all(
    limit: number | null = null,
    offset: number = 0,
    filterGroups: FilterGroup[] = [],
  ): Observable<ProjectModel[]> {
    return super._all<ProjectModel>(limit, offset, filterGroups).pipe(map((f => f.items)));
  }

  /**
   * Get a random project.
   */
  getRandomProject(): Observable<ProjectModel> {
    return this.all().pipe(
      map((items) => {
        return items[Math.floor(Math.random() * items.length)];
      })
    );
  }

  /**(
   *
   * @param projectModel
   */
  loadReadme(projectModel: ProjectModel): Observable<Object> {
    return this.httpClient.get(
      'https://raw.githubusercontent.com/codeplaysoftware/sycl.tech-website/main/README.md',
      {responseType: 'text'}).pipe();
  }

  /**
   * Create a wrapper repo contributor.
   * @param name
   * @param avatar
   * @param url
   */
  static createRepoContributor(name: string, avatar: string, url: string): ContributorModel {
    const anonymous = ContributorService.getAnonymousContributor();
    anonymous.name = name;
    anonymous.username = name;
    anonymous.avatar = avatar;
    anonymous.links = [{
      name: 'GitHub',
      url: url,
      tag: 'github'
    }];

    return anonymous
  }
}
