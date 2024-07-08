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
import { SearchablePage } from '../../components/site-wide-search/SearchablePage';
import { routes } from '../../../app.routes';
import { NewsService } from './news.service';
import { VideosService } from './videos.service';
import { ResearchService } from './research.service';
import { ProjectService } from './project.service';
import { FilterGroup, ResultFilter } from '../../managers/ResultFilterManager';
import { forkJoin, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  /**
   * Constructor.
   * @param newsService
   * @param videoService
   * @param researchService
   * @param projectService
   */
  constructor(
    protected newsService: NewsService,
    protected videoService: VideosService,
    protected researchService: ResearchService,
    protected projectService: ProjectService
  ) { }

  /**
   * Search!
   * @param query
   * @param maxResults
   * @param filters
   */
  search(
    query: string,
    maxResults: number = 20,
    filters: SearchFilters
  ): Observable<SearchResult[]> {
    if (query.length === 0) {
      return of([])
    }

    let searchableObservables = [];

    if (filters.news) {
      searchableObservables.push(this.searchNews(query));
    }

    if (filters.pages) {
      searchableObservables.push(this.searchPages(query));
    }

    if (filters.projects) {
      searchableObservables.push(this.searchProjects(query));
    }

    if (filters.research) {
      searchableObservables.push(this.searchResearch(query));
    }

    if (filters.videos) {
      searchableObservables.push(this.searchVideos(query));
    }

    if (searchableObservables.length === 0) {
      return new Observable<SearchResult[]>(
        (observer) => { observer.next([]); observer.complete(); });
    }

    return forkJoin(searchableObservables).pipe(
      map((results) => {
        return results.flat(1);
      }),
      map((results) => {
        return SearchService.shuffle(results);
      }),
      map((results) => {
        return results.slice(0, maxResults);
      }),
    );
  }

  /**
   * Search the news service.
   * @param query
   */
  protected searchNews(
    query: string
  ): Observable<SearchResult[]> {
    const filterGroups = new FilterGroup('search', [new ResultFilter('*', query)]);

    return this.newsService.all(10, 0, [filterGroups]).pipe(
      map((news) => {
        return news.map((newsModel) => {
          return {
            title: newsModel.title,
            url: newsModel.permalink,
            type: 'news',
            target: '_self',
            thumbnail: newsModel.thumbnail
          }
        })
      })
    );
  }

  /**
   * Search the projects service.
   * @param query
   */
  protected searchProjects(
    query: string
  ): Observable<SearchResult[]> {
    const filterGroups = new FilterGroup('search', [new ResultFilter('*', query)]);

    return this.projectService.all(10, 0, [filterGroups]).pipe(
      map((projects) => {
        return projects.map((result) => {
          return {
            title: result.name,
            url: result.url,
            type: 'project',
            target: '_self',
            icon: 'construction'
          }
        })
      })
    );
  }

  /**
   * Search the research service.
   * @param query
   */
  protected searchResearch(
    query: string
  ): Observable<SearchResult[]> {
    const filterGroups = new FilterGroup('search', [new ResultFilter('*', query)]);

    return this.researchService.all(10, 0, [filterGroups]).pipe(
      map((research) => {
        return research.map((result) => {
          return {
            title: result.title,
            url: result.url,
            type: 'project',
            target: '_self',
            icon: 'receipt_long'
          }
        })
      })
    );
  }

  /**
   * Search the videos service.
   * @param query
   */
  protected searchVideos(
    query: string
  ): Observable<SearchResult[]> {
    const filterGroups = new FilterGroup('search', [new ResultFilter('*', query)]);

    return this.videoService.all(10, 0, [filterGroups]).pipe(
      map((videos) => {
        return videos.map((result) => {
          return {
            title: result.title,
            url: result.url,
            type: 'project',
            target: '_self',
            image: result.thumbnail
          }
        })
      })
    );
  }

  /**
   * Search all routes that implement the SearchablePage interface.
   */
  protected searchPages(
    query: string
  ): Observable<SearchResult[]> {
    return new Observable<SearchResult[]>(observer => {
      setInterval(() => {
        const foundPaths: any[] = [];
        const matched: SearchResult[] = routes.filter((route) => {
          return (route.component !== undefined
            && SearchService.isSearchablePageInstance(route.component.prototype));
        }).map((route) => {
          return route.component?.prototype;
        }).filter((page) => {
          if (SearchService.partiallyIncludes(page.getKeywords(), query)
            && !foundPaths.includes(page.getDefaultRoutePath())) {
            foundPaths.push(page.getDefaultRoutePath());
            return true;
          }

          return false;
        }).map((page) => {
          return {
            title: page.getTitle(),
            url: page.getDefaultRoutePath(),
            type: 'page',
            target: '_self',
            description: page.getDescription(),
            icon: 'layers'
          }
        });

        observer.next(matched);
        observer.complete();
      });
    });
  }

  /**
   * Checks if a searchTerm value matches any of the values in arrayOfTerm in a partial way.
   * @param arrayOfTerm
   * @param searchTerm
   */
  private static partiallyIncludes(
    arrayOfTerm: any,
    searchTerm: string
  ): boolean {
    searchTerm = searchTerm.toLowerCase();
    let termsToCheck: string[] = [];

    if (typeof arrayOfTerm === 'string') {
      termsToCheck = arrayOfTerm.toLowerCase().split(' ');
    } else if (arrayOfTerm instanceof Array) {
      termsToCheck = arrayOfTerm.map((term) => {
        return term.toLowerCase();
      });
    }

    for (const term of termsToCheck) {
      if (term.includes(searchTerm)) {
        return true;
      }

      if (term.startsWith(searchTerm)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Checks if a page implements SearchablePage using guards.
   * @param object
   * @private
   */
  private static isSearchablePageInstance(
    object: any
  ): object is SearchablePage {
    return 'getTitle' in object
      && 'getKeywords' in object
      && 'getDefaultRoutePath' in object;
  }

  /**
   * Shuffle an array.
   * @param array
   * @private
   */
  private static shuffle(array: any) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }
}

/**
 * Search result interface.
 */
export interface SearchResult {
  title: string
  url: string
  type: string
  target: string
  description?: string
  icon?: string
  thumbnail?: string
}

/**
 * Search areas interface.
 */
export interface SearchFilters {
  news: true
  videos: true
  research: true
  projects: true
  pages: true
}
