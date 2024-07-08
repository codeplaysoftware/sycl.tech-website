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
import { LessonWidgetComponent } from './shared/lesson-widget/lesson-widget.component';
import { Meta, Title } from '@angular/platform-browser';
import { AcademyLessonService } from '../../../shared/services/models/academy-lesson.service';
import { LessonModel } from '../../../shared/models/lesson.model';
import { SearchablePage } from '../../../shared/components/site-wide-search/SearchablePage';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'st-academy',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LessonWidgetComponent,
    NgOptimizedImage
  ],
  templateUrl: './academy.component.html',
  styleUrl: './academy.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AcademyComponent implements SearchablePage {
  protected readonly lessons: Signal<LessonModel[]>;

  /**
   * Constructor.
   * @param titleService
   * @param academyLessonService
   * @param meta
   */
  constructor(
    protected titleService: Title,
    protected academyLessonService: AcademyLessonService,
    protected meta: Meta
  ) {
    this.titleService.setTitle('Academy - SYCL.tech');
    this.meta.addTag({ name: 'keywords', content: this.getKeywords().join(', ') });
    this.meta.addTag({ name: 'description', content: this.getDescription() });

    this.lessons = toSignal(this.academyLessonService.all(), { initialValue: [] });
  }

  /**
   * Get a link to a specific lesson.
   * @param lesson
   */
  getRouterLink(lesson: LessonModel) {
    return '../lesson/' + lesson.number;
  }

  /**
   * @inheritDoc
   */
  getKeywords(): string[] {
    return ['academy', 'lessons', 'started', 'learn', 'guides', 'tutorial'];
  }

  /**
   * @inheritDoc
   */
  getTitle(): string {
    return 'SYCL Academy';
  }

  /**
   * @inheritDoc
   */
  getDescription() {
    return 'Walk through the Academy lessons and get up to speed with SYCL and related technologies.';
  }

  /**
   * @inheritDoc
   */
  getDefaultRoutePath() {
    return '/getting-started/academy';
  }
}
