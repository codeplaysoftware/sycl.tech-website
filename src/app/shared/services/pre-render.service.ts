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
import { NewsService } from './models/news.service';
import { VideosService } from './models/videos.service';
import { ContributorService } from './models/contributor.service';
import { EventService } from './models/event.service';
import { PlaygroundSampleService } from './models/playground-sample.service';
import { ResearchService } from './models/research.service';
import { AcademyLessonService } from './models/academy-lesson.service';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreRenderService {
  /**
   * Called only when pre-rendering. This function will call all the services and fetch all their data, storing the
   * output in the TransferState. This means, that no backend API calls should occur.
   */
  constructor(
    protected newsService: NewsService,
    protected videoService: VideosService,
    protected contributorService: ContributorService,
    protected eventService: EventService,
    protected playgroundSampleService: PlaygroundSampleService,
    protected researchService: ResearchService,
    protected academyLessonService: AcademyLessonService,
  ) { }

  run() {
    console.log('Running pre rendering service');

    this.newsService.all().pipe(take(1)).subscribe(() => null);
    this.videoService.all().pipe(take(1)).subscribe(() => null);
    this.contributorService.all().pipe(take(1)).subscribe(() => null);
    this.eventService.all().pipe(take(1)).subscribe(() => null);
    this.playgroundSampleService.getSamples().pipe(take(1)).subscribe(() => null);
    this.researchService.all().pipe(take(1)).subscribe(() => null);
    this.academyLessonService.all().pipe(take(1)).subscribe(() => null);
  }
}
