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

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnDestroy,
  OnInit,
  Signal,
  signal,
  WritableSignal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { NewsService } from '../../shared/services/models/news.service';
import { NewsModel } from '../../shared/models/news.model';
import { NewsWidgetComponent, NewsWidgetLayout } from '../news/shared/news-widget/news-widget.component';
import { RouterLink } from '@angular/router';
import { ProjectModel } from '../../shared/models/project.model';
import { ProjectService } from '../../shared/services/models/project.service';
import { VideosService } from '../../shared/services/models/videos.service';
import { ResearchService } from '../../shared/services/models/research.service';
import { ResearchModel } from '../../shared/models/research.model';
import { VideoModel } from '../../shared/models/video.model';
import {
  ProjectWidgetComponent,
  ProjectWidgetLayout
} from '../ecosystem/projects/shared/project-widget/project-widget.component';
import { VideoWidgetComponent } from '../ecosystem/videos/video-widget/video-widget.component';
import {
  ResearchWidgetComponent,
  ResearchWidgetLayout
} from '../ecosystem/research/shared/research-widget/research-widget.component';
import {
  QuickLink,
  QuickLinksComponent,
  QuickLinkType
} from '../../shared/components/quick-links/quick-links.component';
import { PopupService } from '../../shared/components/popup/popup.service';
import { ChangeStartDateComponent } from './change-start-date-popup/change-start-date.component';
import { catchError, firstValueFrom, of, tap } from 'rxjs';
import { LoadingState } from '../../shared/LoadingState';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { SafeStorageService } from '../../shared/services/safe-storage.service';
import { PlatformService } from '../../shared/services/platform.service';

@Component({
  selector: 'st-changed',
  standalone: true,
  imports: [
    CommonModule,
    NewsWidgetComponent,
    RouterLink,
    ProjectWidgetComponent,
    VideoWidgetComponent,
    ResearchWidgetComponent,
    QuickLinksComponent,
    LoadingComponent
  ],
  templateUrl: './changed.component.html',
  styleUrl: './changed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangedComponent implements OnInit, OnDestroy {
  protected static readonly STORAGE_LAST_VISIT = 'st-last-visit-date';

  protected readonly startDate: WritableSignal<Date | undefined> = signal(undefined);
  protected readonly currentDate: WritableSignal<Date> = signal(new Date());
  protected readonly quickLinks: Signal<QuickLink[]>;

  protected readonly newsLoadingState: WritableSignal<LoadingState> = signal(LoadingState.NOT_STARTED);
  protected readonly projectsLoadingState: WritableSignal<LoadingState> = signal(LoadingState.NOT_STARTED);
  protected readonly videoLoadingState: WritableSignal<LoadingState> = signal(LoadingState.NOT_STARTED);
  protected readonly researchLoadingState: WritableSignal<LoadingState> = signal(LoadingState.NOT_STARTED);

  protected readonly updatedNews: WritableSignal<NewsModel[]> = signal([]);
  protected readonly updatedProjects: WritableSignal<ProjectModel[]> = signal([]);
  protected readonly updatedVideos: WritableSignal<VideoModel[]> = signal([]);
  protected readonly updatedResearch: WritableSignal<ResearchModel[]> = signal([]);

  protected readonly NewsWidgetLayout = NewsWidgetLayout;
  protected readonly ProjectWidgetLayout = ProjectWidgetLayout;
  protected readonly ResearchWidgetLayout = ResearchWidgetLayout;
  protected readonly LoadingState = LoadingState;

  protected saveTimer: any = undefined;

  /**
   * Constructor.
   * @param title
   * @param platformService
   * @param safeStorageService
   * @param popupService
   * @param projectService
   * @param newsService
   * @param researchService
   * @param videosService
   */
  constructor(
    protected title: Title,
    protected platformService: PlatformService,
    protected safeStorageService: SafeStorageService,
    protected popupService: PopupService,
    protected projectService: ProjectService,
    protected newsService: NewsService,
    protected researchService : ResearchService,
    protected videosService: VideosService,
  ) {
    this.title.setTitle('Digest - SYCL.tech');

    // Compute the quick links signal
    this.quickLinks = computed(() => {
      // Escape early if we haven't started loading yet
      if (this.newsLoadingState() == LoadingState.NOT_STARTED) {
        return [];
      }

      return [
        {
          name: `News (${this.updatedNews().length})`,
          url: 'news',
          type: QuickLinkType.FRAGMENT
        },
        {
          name: `Projects (${this.updatedProjects().length})`,
          url: 'projects',
          type: QuickLinkType.FRAGMENT
        },
        {
          name: `Videos (${this.updatedVideos().length})`,
          url: 'videos',
          type: QuickLinkType.FRAGMENT
        },
        {
          name: `Research Papers (${this.updatedResearch().length})`,
          url: 'research',
          type: QuickLinkType.FRAGMENT
        }
      ];
    });
  }

  /**
   * @inheritdoc
   */
  ngOnInit() {
    if (this.platformService.isClient()) {
      if (this.safeStorageService.has(ChangedComponent.STORAGE_LAST_VISIT)) {
        const lastVisitDate = new Date(this.safeStorageService.get(ChangedComponent.STORAGE_LAST_VISIT));
        this.startDate.set(lastVisitDate);
        this.reload();
      } else {
        this.onDateSelectorClicked();
        this.saveLastVisit();
      }

      this.saveTimer = setInterval(() => {
        console.log('Automatically updating last visit time.');
        this.saveLastVisit();
      }, 6000);
    }
  }

  /**
   * @inheritdoc
   */
  ngOnDestroy() {
    this.stopAutosave();
  }

  /**
   * Stop any autosave timers.
   */
  stopAutosave() {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
    }
  }

  /**
   * Reload all the content.
   */
  reload() {
    const startDate = this.startDate();

    if (!startDate) {
      return;
    }

    ChangedComponent.populate(
      this.projectService, this.projectsLoadingState, this.updatedProjects, startDate);

    ChangedComponent.populate(
      this.newsService, this.newsLoadingState, this.updatedNews, startDate);

    ChangedComponent.populate(
      this.researchService, this.researchLoadingState, this.updatedResearch, startDate);

    ChangedComponent.populate(
      this.videosService, this.videoLoadingState, this.updatedVideos, startDate);
  }

  /**
   * Called when a user clicks on the start date, if they want to change the date.
   */
  onDateSelectorClicked() {
    firstValueFrom(this.popupService.create(ChangeStartDateComponent, this.startDate(), true).onChanged)
      .then(
        (date) => {
          if (date) {
            this.stopAutosave();
            this.startDate.set(date);
            this.reload();
            this.saveLastVisit(date);
          }
        }
      );
  }

  /**
   * Update the last visit date in storage.
   */
  saveLastVisit(date?: Date) {
    try {
      if (!date) {
        date = new Date();
      }

      this.safeStorageService.save(ChangedComponent.STORAGE_LAST_VISIT, date);
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Populate results from the provided services, updating loading states etc.
   * @param service
   * @param loadingState
   * @param resultSignal
   * @param startDate
   */
  static populate(
    service: any,
    loadingState: WritableSignal<LoadingState>,
    resultSignal: WritableSignal<any>,
    startDate: Date
  ) {
    firstValueFrom(
      service.afterDate(startDate)
        .pipe(
          tap(() => loadingState.set(LoadingState.LOAD_SUCCESS)),
          catchError((error) => {
            loadingState.set(LoadingState.LOAD_FAILURE);
            return of(error)
          })
        )
    ).then((items) => resultSignal.set(items))
  }
}
