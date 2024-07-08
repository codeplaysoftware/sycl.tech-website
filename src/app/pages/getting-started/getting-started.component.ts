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
import { ChangeDetectionStrategy, Component, inject, Injector, OnInit, Signal } from '@angular/core';
import { LessonWidgetComponent } from './academy/shared/lesson-widget/lesson-widget.component';
import {
  QuickLink,
  QuickLinksComponent,
  QuickLinkType
} from '../../shared/components/quick-links/quick-links.component';
import {
  MiniPlaygroundCodeBlockComponent
} from '../playground/shared/mini-playground-code-block/mini-playground-code-block.component';
import { Meta, Title } from '@angular/platform-browser';
import { PlaygroundSampleService } from '../../shared/services/models/playground-sample.service';
import { PlaygroundSampleModel } from '../../shared/models/playground-sample.model';
import { AcademyLessonService } from '../../shared/services/models/academy-lesson.service';
import { LessonModel } from '../../shared/models/lesson.model';
import { RouterLink } from '@angular/router';
import { SearchablePage } from '../../shared/components/site-wide-search/SearchablePage';
import { toSignal } from '@angular/core/rxjs-interop';
import { TabComponent } from '../../shared/components/tabs/tab/tab.component';
import { TabsComponent } from '../../shared/components/tabs/tabs.component';

@Component({
  selector: 'st-getting-started',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LessonWidgetComponent,
    QuickLinksComponent,
    MiniPlaygroundCodeBlockComponent,
    NgOptimizedImage,
    TabComponent,
    TabsComponent,
  ],
  templateUrl: './getting-started.component.html',
  styleUrl: './getting-started.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GettingStartedComponent implements SearchablePage, OnInit {
  protected readonly injector = inject(Injector)
  protected playgroundCodeSample: Signal<PlaygroundSampleModel> | undefined;
  protected lessons: Signal<LessonModel[]> | undefined;

  /**
   * Constructor.
   * @param playgroundSampleService
   * @param academyLessonService
   * @param titleService
   * @param meta
   */
  constructor(
    protected playgroundSampleService: PlaygroundSampleService,
    protected academyLessonService: AcademyLessonService,
    protected titleService: Title,
    protected meta: Meta
  ) {
    this.titleService.setTitle('Getting Started - SYCL.tech');
    this.meta.addTag({ name: 'keywords', content: this.getKeywords().join(', ') });
    this.meta.addTag({ name: 'description', content: this.getDescription() });
  }

  /**
   * @inheritDoc
   */
  ngOnInit() {
    this.playgroundCodeSample = toSignal(
      this.playgroundSampleService.getSampleByTag('vector-addition'), {
        initialValue: PlaygroundSampleService.getDefaultSample(),
        injector: this.injector
      });

    this.lessons = toSignal(
      this.academyLessonService.all(6), {
        initialValue: [],
        injector: this.injector
      });
  }

  /**
   * Get an array of quick links.
   */
  getQuickLinks(): QuickLink[] {
    return [
      {
        name: 'Try Code',
        url: 'try',
        type: QuickLinkType.FRAGMENT
      },
      {
        name: 'eBook',
        url: 'ebook',
        type: QuickLinkType.FRAGMENT
      },
      {
        name: 'Academy',
        url: 'academy',
        type: QuickLinkType.FRAGMENT
      },
      {
        name: 'Implementations',
        url: 'implementations',
        type: QuickLinkType.FRAGMENT
      }
    ]
  }

  /**
   * @inheritDoc
   */
  getKeywords(): string[] {
    return ['started', 'getting', 'learn', 'tutorials', 'guides'];
  }

  /**
   * @inheritDoc
   */
  getTitle(): string {
    return 'Getting Started';
  }

  /**
   * @inheritDoc
   */
  getDescription() {
    return 'Get started with SYCL, try some code, follow the Academy guides and install and implementation.';
  }

  /**
   * @inheritDoc
   */
  getDefaultRoutePath() {
    return '/getting-started';
  }
}
