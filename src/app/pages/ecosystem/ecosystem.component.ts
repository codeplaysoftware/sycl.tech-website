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

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { ProjectWidgetComponent } from './projects/shared/project-widget/project-widget.component';
import { ProjectService } from '../../shared/services/models/project.service';
import { ProjectModel } from '../../shared/models/project.model';
import { VideosService } from '../../shared/services/models/videos.service';
import { VideoModel } from '../../shared/models/video.model';
import { VideoWidgetComponent } from './videos/video-widget/video-widget.component';
import { ResearchService } from '../../shared/services/models/research.service';
import { ResearchModel } from '../../shared/models/research.model';
import { ResearchWidgetComponent } from './research/shared/research-widget/research-widget.component';
import {
  QuickLink,
  QuickLinksComponent,
  QuickLinkType
} from '../../shared/components/quick-links/quick-links.component';
import { RouterLink } from '@angular/router';
import { SearchablePage } from '../../shared/components/site-wide-search/SearchablePage';
import { Meta, Title } from '@angular/platform-browser';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'st-ecosystem',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ProjectWidgetComponent,
    VideoWidgetComponent,
    ResearchWidgetComponent,
    QuickLinksComponent
  ],
  templateUrl: './ecosystem.component.html',
  styleUrl: './ecosystem.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EcosystemComponent implements SearchablePage {
  protected readonly project: Signal<ProjectModel | undefined>;
  protected readonly video: Signal<VideoModel | undefined>;
  protected readonly research: Signal<ResearchModel | undefined>;

  /**
   * Constructor.
   * @param projectService
   * @param videoService
   * @param researchService
   * @param title
   * @param meta
   */
  constructor(
    protected projectService: ProjectService,
    protected videoService: VideosService,
    protected researchService: ResearchService,
    protected title: Title,
    protected meta: Meta
  ) {
    this.title.setTitle('Ecosystem - SYCL.tech')
    this.meta.addTag({ name: 'keywords', content: this.getKeywords().join(', ') });
    this.meta.addTag({ name: 'description', content: this.getDescription() });

    this.project = toSignal(this.projectService.getRandomProject(), { initialValue: undefined });
    this.video = toSignal(this.videoService.getRandomVideo(), { initialValue: undefined });
    this.research = toSignal(this.researchService.getRandomResearchPaper(), { initialValue: undefined });
  }

  /**
   * Return a list of quick links.
   */
  getQuickLinks(): QuickLink[] {
    return [
      {
        name: 'Projects',
        url: 'projects',
        type: QuickLinkType.FRAGMENT
      },
      {
        name: 'Research',
        url: 'research',
        type: QuickLinkType.FRAGMENT
      },
      {
        name: 'Videos',
        url: 'videos',
        type: QuickLinkType.FRAGMENT
      }
    ]
  }

  /**
   * @inheritDoc
   */
  getKeywords(): string[] {
    return ['ecosystem', 'projects', 'videos', 'research'];
  }

  /**
   * @inheritDoc
   */
  getTitle(): string {
    return 'Ecosystem';
  }

  /**
   * @inheritDoc
   */
  getDescription() {
    return 'Ecosystem, home to all our tracked SYCL projects, videos, presentations and research papers.';
  }

  /**
   * @inheritDoc
   */
  getDefaultRoutePath() {
    return '/ecosystem/';
  }
}
