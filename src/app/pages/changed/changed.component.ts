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
  OnInit,
  Signal,
  signal,
  WritableSignal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { NewsModel } from '../../shared/models/news.model';
import { NewsWidgetComponent, NewsWidgetLayout } from '../news/shared/news-widget/news-widget.component';
import { RouterLink } from '@angular/router';
import { ProjectModel } from '../../shared/models/project.model';
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
import { catchError, firstValueFrom, Observable, of, tap } from 'rxjs';
import { LoadingState } from '../../shared/LoadingState';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { PlatformService } from '../../shared/services/platform.service';
import { ChangedService } from '../../shared/services/changed.service';
import { EventModel } from '../../shared/models/event.model';
import {
  CalendarWidgetLayout,
  CalenderWidgetComponent
} from '../calendar/shared/calendar-item-widget/calender-widget.component';

@Component({
  selector: 'st-changed',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NewsWidgetComponent,
    ProjectWidgetComponent,
    VideoWidgetComponent,
    ResearchWidgetComponent,
    QuickLinksComponent,
    LoadingComponent,
    CalenderWidgetComponent
  ],
  templateUrl: './changed.component.html',
  styleUrl: './changed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangedComponent implements OnInit {
  protected readonly startDate: WritableSignal<Date | undefined> = signal(undefined);
  protected readonly currentDate: WritableSignal<Date> = signal(new Date());
  protected readonly quickLinks: Signal<QuickLink[]>;

  protected readonly newsLoadingState: WritableSignal<LoadingState> = signal(LoadingState.NOT_STARTED);
  protected readonly projectsLoadingState: WritableSignal<LoadingState> = signal(LoadingState.NOT_STARTED);
  protected readonly videoLoadingState: WritableSignal<LoadingState> = signal(LoadingState.NOT_STARTED);
  protected readonly researchLoadingState: WritableSignal<LoadingState> = signal(LoadingState.NOT_STARTED);
  protected readonly eventLoadingState: WritableSignal<LoadingState> = signal(LoadingState.NOT_STARTED);

  protected readonly updatedNews: WritableSignal<NewsModel[]> = signal([]);
  protected readonly updatedProjects: WritableSignal<ProjectModel[]> = signal([]);
  protected readonly updatedVideos: WritableSignal<VideoModel[]> = signal([]);
  protected readonly updatedResearch: WritableSignal<ResearchModel[]> = signal([]);
  protected readonly updatedEvents: WritableSignal<EventModel[]> = signal([]);

  protected readonly NewsWidgetLayout = NewsWidgetLayout;
  protected readonly ProjectWidgetLayout = ProjectWidgetLayout;
  protected readonly ResearchWidgetLayout = ResearchWidgetLayout;
  protected readonly LoadingState = LoadingState;

  /**
   * Constructor
   * @param title
   * @param changedService
   * @param platformService
   * @param popupService
   */
  constructor(
    protected title: Title,
    protected changedService: ChangedService,
    protected platformService: PlatformService,
    protected popupService: PopupService
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
      let lastVisitDate = this.changedService.lastVisitDate();

      if (lastVisitDate) {
        this.startDate.set(lastVisitDate);
        this.reload();
      } else {
        lastVisitDate = new Date();
        lastVisitDate.setDate(lastVisitDate.getDate() - 14);

        this.startDate.set(lastVisitDate);
        this.onDateSelectorClicked();
      }
    }
  }

  /**
   * Reload all the content.
   */
  reload() {
    const startDate = this.startDate();

    if (!startDate) {
      // Escape early if no start date is set
      return;
    }

    ChangedComponent.populate(
      this.changedService.events(startDate), this.eventLoadingState, this.updatedEvents);

    ChangedComponent.populate(
      this.changedService.news(startDate), this.newsLoadingState, this.updatedNews);

    ChangedComponent.populate(
      this.changedService.projects(startDate), this.projectsLoadingState, this.updatedProjects);

    ChangedComponent.populate(
      this.changedService.research(startDate), this.researchLoadingState, this.updatedResearch);

    ChangedComponent.populate(
      this.changedService.videos(startDate), this.videoLoadingState, this.updatedVideos);

    // Update the last visit time
    this.changedService.saveLastVisitDate();
  }

  /**
   * Called when a user clicks on the start date, if they want to change the date.
   */
  onDateSelectorClicked() {
    firstValueFrom(this.popupService.create(ChangeStartDateComponent, this.startDate(), true).onChanged)
      .then(
        (date) => {
          if (date) {
            this.startDate.set(date);
            this.reload();
          }
        }
      );
  }

  /**
   * Populate results from the provided services, updating loading states etc.
   * @param observable
   * @param loadingState
   * @param resultSignal
   */
  static populate(
    observable: Observable<any>,
    loadingState: WritableSignal<LoadingState>,
    resultSignal: WritableSignal<any>
  ) {
    firstValueFrom(
      observable
        .pipe(
          tap(() => loadingState.set(LoadingState.LOAD_SUCCESS)),
          catchError((error) => {
            loadingState.set(LoadingState.LOAD_FAILURE);
            return of(error)
          })
        )
    ).then((items) => resultSignal.set(items))
  }

  protected readonly CalendarWidgetLayout = CalendarWidgetLayout;
}
