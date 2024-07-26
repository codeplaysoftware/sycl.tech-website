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

import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NewsModel } from '../../shared/models/news.model';
import { NewsService } from '../../shared/services/models/news.service';
import { NewsWidgetLayout, NewsWidgetComponent } from '../news/shared/news-widget/news-widget.component';
import { SearchablePage } from '../../shared/components/site-wide-search/SearchablePage';
import { Meta, Title } from '@angular/platform-browser';
import { DateDisplayComponent } from '../../shared/components/date-display/date-display.component';
import { VideosService } from '../../shared/services/models/videos.service';
import { ResearchService } from '../../shared/services/models/research.service';
import { ProjectModel } from '../../shared/models/project.model';
import { VideoModel } from '../../shared/models/video.model';
import { VideoWidgetComponent } from '../ecosystem/videos/video-widget/video-widget.component';
import { ProjectWidgetComponent } from '../ecosystem/projects/shared/project-widget/project-widget.component';
import { EventService } from '../../shared/services/models/event.service';
import { EventModel } from '../../shared/models/event.model';
import { ContributorAvatarComponent } from '../../shared/components/contributor-avatar/contributor-avatar.component';
import {
  LayeredContributorAvatarsComponent
} from '../../shared/components/layered-contributor-avatars/layered-contributor-avatars.component';
import { ContributorModel } from '../../shared/models/contributor.model';
import { ContributorService } from '../../shared/services/models/contributor.service';
import {
  MiniPlaygroundCodeBlockComponent
} from '../playground/shared/mini-playground-code-block/mini-playground-code-block.component';
import { ScrollingPanelComponent } from './shared/scrolling-panel/scrolling-panel.component';
import { PinnedModel } from '../../shared/models/pinned.model';
import { ProjectService } from '../../shared/services/models/project.service';
import {
  ImplementationActivityModel,
  ImplementationActivityType
} from '../../shared/models/implementation-activity.model';
import { PlaygroundSampleService } from '../../shared/services/models/playground-sample.service';
import { PlaygroundSampleModel } from '../../shared/models/playground-sample.model';
import { ImplementationActivityService } from '../../shared/services/models/implementation-activity.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { CalenderWidgetComponent } from '../calendar/shared/calendar-item-widget/calender-widget.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'st-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NewsWidgetComponent,
    DateDisplayComponent,
    VideoWidgetComponent,
    ProjectWidgetComponent,
    ContributorAvatarComponent,
    LayeredContributorAvatarsComponent,
    MiniPlaygroundCodeBlockComponent,
    ScrollingPanelComponent,
    CalenderWidgetComponent,
    NgOptimizedImage,
  ],
  templateUrl: './home.component.html',
  styleUrls: [
    './sub-panel-styling.scss',
    './home.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements SearchablePage {
  protected readonly news: Signal<NewsModel[]>;
  protected readonly contributors: Signal<ContributorModel[]>;
  protected readonly communityUpdates: Signal<ImplementationActivityModel[]>;
  protected readonly events: Signal<EventModel[]>;
  protected readonly yearlyEventCount: Signal<number>;
  protected readonly pinned: Signal<PinnedModel[]>;
  protected readonly randomVideo: Signal<VideoModel | undefined>;
  protected readonly randomProject: Signal<ProjectModel | undefined>;
  protected readonly playgroundCodeSample: Signal<PlaygroundSampleModel>;
  protected readonly projectCount: Signal<number>;
  protected readonly videoCount: Signal<number>;
  protected readonly researchCount: Signal<number>;

  protected readonly Layout = NewsWidgetLayout;
  protected readonly CommunityUpdateModelType = ImplementationActivityType;

  /**
   * Constructor
   * @param meta
   * @param titleService
   * @param playgroundSampleService
   * @param newsService
   * @param communityUpdateService
   * @param eventService
   * @param projectService
   * @param researchService
   * @param videoService
   * @param contributorService
   */
  constructor(
    protected meta: Meta,
    protected titleService: Title,
    protected playgroundSampleService: PlaygroundSampleService,
    protected newsService: NewsService,
    protected communityUpdateService: ImplementationActivityService,
    protected eventService: EventService,
    protected projectService: ProjectService,
    protected researchService: ResearchService,
    protected videoService: VideosService,
    protected contributorService: ContributorService,
  ) {
    this.titleService.setTitle('Home - SYCL.tech');
    this.meta.addTag({ name: 'keywords', content: this.getKeywords().join(', ') });
    this.meta.addTag({ name: 'description', content: this.getDescription() });

    this.news = toSignal(
      this.newsService.all(4), { initialValue: [] });

    this.contributors = toSignal(
      this.contributorService.all(6), { initialValue: [] });

    this.communityUpdates = toSignal(
      this.communityUpdateService.all(6), { initialValue: [] });

    this.events = toSignal(
      this.eventService.getUpcomingEvents(4), { initialValue: [] });

    this.yearlyEventCount = toSignal(
      this.eventService.getYearlyEventCount(new Date().getFullYear()), { initialValue: 0 } );

    this.pinned = toSignal(
      this.newsService.getPinned(), { initialValue: [] });

    this.randomVideo = toSignal(
      this.videoService.getRandomVideo(), { initialValue: undefined });

    this.randomProject = toSignal(
      this.projectService.getRandomProject(), { initialValue: undefined });

    this.playgroundCodeSample = toSignal(
      this.playgroundSampleService.getSampleByTag('hello-world-on-device'),
      { initialValue: PlaygroundSampleService.getDefaultSample() });

    this.projectCount = toSignal(
      this.projectService.count(), { initialValue: 0 });

    this.videoCount = toSignal(
      this.videoService.count(), { initialValue: 0 });

    this.researchCount = toSignal(
      this.researchService.count(), { initialValue: 0 });
  }

  /**
   * @inheritDoc
   */
  getKeywords(): string[] {
    return ['home', 'default', 'index'];
  }

  /**
   * @inheritDoc
   */
  getDescription() {
    return 'The SYCL.tech home page, for all the latest, news, videos, projects and all other things SYCL!';
  }

  /**
   * @inheritDoc
   */
  getTitle(): string {
    return 'Home';
  }

  /**
   * @inheritDoc
   */
  getDefaultRoutePath() {
    return '/';
  }

  protected readonly environment = environment;
}
