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

import { ChangeDetectionStrategy, Component, Inject, signal, WritableSignal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { PopupReference } from '../../../../../../shared/components/popup/PopupService';
import { ProjectModel } from '../../../../../../shared/models/project.model';
import { ProjectService } from '../../../../../../shared/services/models/project.service';
import { take, tap } from 'rxjs';
import { TagComponent } from '../../../../../../shared/components/tag/tag.component';
import {
  LayeredContributorAvatarsComponent
} from '../../../../../../shared/components/layered-contributor-avatars/layered-contributor-avatars.component';
import { MarkdownComponent, MarkdownService } from 'ngx-markdown';
import { LoadingState } from '../../../../../../shared/LoadingState';
import { LoadingComponent } from '../../../../../../shared/components/loading/loading.component';

@Component({
  selector: 'st-project-view-popup',
  standalone: true,
  templateUrl: './project-view-popup.component.html',
  imports: [
    NgOptimizedImage,
    TagComponent,
    LayeredContributorAvatarsComponent,
    MarkdownComponent,
    LoadingComponent
  ],
  styleUrls: [
    '../../../../../../shared/components/popup/styles/common.scss',
    '../../../../../../shared/components/popup/styles/side-header.scss',
    './project-view-popup.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectViewPopupComponent {
  protected project: WritableSignal<ProjectModel>;
  protected loading: WritableSignal<LoadingState> = signal(LoadingState.LOADING);
  protected readme: WritableSignal<string> = signal('Loading..');

  protected readonly LoadingState = LoadingState;

  /**
   * Constructor.
   * @param popupReference
   * @param projectService
   * @param markdownService
   */
  constructor(
    @Inject('POPUP_DATA') protected popupReference: PopupReference,
    protected projectService: ProjectService,
    private markdownService: MarkdownService
  ) {
    this.project = popupReference.data['project'];

    this.projectService.loadReadme(this.project()).pipe(
      tap((contents) => {
        const parsed = this.markdownService.parse(contents.toString());
        this.readme.set(parsed.toString());
        this.loading.set(LoadingState.LOAD_SUCCESS);
      }),
      take(1)
    ).subscribe()
  }
}
