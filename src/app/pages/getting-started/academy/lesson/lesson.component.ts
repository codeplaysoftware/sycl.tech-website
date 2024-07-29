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

import { CommonModule, Location, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal, Signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, Observable, switchMap, tap } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';
import { LoadingState } from '../../../../shared/LoadingState';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { LessonModel } from '../../../../shared/models/lesson.model';
import { AcademyLessonService } from '../../../../shared/services/models/academy-lesson.service';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { FormsModule } from '@angular/forms';
import { PlatformService } from '../../../../shared/services/platform.service';
import { StateService } from '../../../../shared/services/state.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { TabComponent } from '../../../../shared/components/tabs/tab/tab.component';
import { TabsComponent } from '../../../../shared/components/tabs/tabs.component';

@Component({
  selector: 'st-lesson',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    LoadingComponent,
    MonacoEditorModule,
    NgOptimizedImage,
    TabComponent,
    TabsComponent
  ],
  templateUrl: './lesson.component.html',
  styleUrls: [
    './lesson.component.scss',
    './lesson-content-styling.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LessonComponent {
  protected readonly LoadingState = LoadingState;
  protected readonly showMonacoEditor: boolean = false;

  protected readonly monacoEditorTheme: Signal<string>;
  protected readonly lessons: Signal<LessonModel[]>;
  protected readonly lesson: Signal<LessonModel | undefined>;
  protected readonly state: WritableSignal<LoadingState> = signal(LoadingState.LOADING);
  protected readonly hideLessonList: WritableSignal<boolean> = signal(true);
  protected readonly selectedTabName: WritableSignal<string | undefined> = signal(undefined);

  /**
   * Constructor.
   * @param activatedRoute
   * @param academyLessonService
   * @param platformService
   * @param stateService
   * @param titleService
   * @param meta
   * @param location
   */
  constructor(
    protected activatedRoute: ActivatedRoute,
    protected academyLessonService: AcademyLessonService,
    protected platformService: PlatformService,
    protected stateService: StateService,
    protected titleService: Title,
    protected meta: Meta,
    protected location: Location
  ) {
    const lesson = this.activatedRoute.params.pipe(
      switchMap(params => this.loadLessonContent(params['lessonTag'], params['tabName'])));

    this.lesson = toSignal(lesson);
    this.lessons = toSignal(this.academyLessonService.all(), { initialValue: [] });

    this.monacoEditorTheme = toSignal(
      this.stateService.getObservable().pipe(map(state => state.darkModeEnabled ? 'st-dark' : 'vs-light')),
      { initialValue: 'vs-light' })

    if (this.platformService.isClient()) {
      this.showMonacoEditor = true;
    }
  }

  /**
   * Load a lesson content by its tag and its lesson, source or solution tab.
   * @param tag
   * @param tabName
   */
  protected loadLessonContent(tag: string, tabName?: string): Observable<LessonModel> {
    this.state.set(LoadingState.LOADING);

    return this.academyLessonService.getByTag(tag)
      .pipe(
        tap((lesson) => {
          this.titleService.setTitle(lesson.title + ' - Academy - SYCL.tech');
          this.meta.addTag({ name: 'description', content: lesson.description });

          this.selectedTabName.set(tabName);
          this.state.set(LoadingState.LOAD_SUCCESS)
        })
      );
  }

  /**
   * Toggle the lesson list.
   */
  onToggleLessonList() {
    this.hideLessonList.set(!this.hideLessonList());
  }

  /**
   * Called when a user changes the current tab. Updates the URL to match the current state.
   */
  onTabChange() {
    this.location.replaceState(
      `/getting-started/academy/${this.lesson()?.tag}/${this.selectedTabName()?.toLowerCase()}`)
  }
}
