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
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { PopupReference } from '../../../../../../shared/components/popup/popup.service';
import { ProjectModel } from '../../../../../../shared/models/project.model';
import { ProjectService } from '../../../../../../shared/services/models/project.service';
import { catchError, of, take, tap } from 'rxjs';
import { TagComponent } from '../../../../../../shared/components/tag/tag.component';
import {
  LayeredContributorAvatarsComponent
} from '../../../../../../shared/components/layered-contributor-avatars/layered-contributor-avatars.component';
import { MarkdownComponent } from 'ngx-markdown';
import { LoadingState } from '../../../../../../shared/LoadingState';
import { LoadingComponent } from '../../../../../../shared/components/loading/loading.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CopyInputComponent } from '../../../../../../shared/components/copy-input/copy-input.component';
import {
  ContributorAvatarComponent
} from '../../../../../../shared/components/contributor-avatar/contributor-avatar.component';
import { MultiDateComponent } from '../../../../../../shared/components/multi-date/multi-date.component';
import { FilterManager, UITagGroup } from '../../../../../../shared/components/filter-result-layout/FilterManager';

@Component({
  selector: 'st-project-view-popup',
  standalone: true,
  templateUrl: './project-view-popup.component.html',
  imports: [
    NgOptimizedImage,
    TagComponent,
    LayeredContributorAvatarsComponent,
    MarkdownComponent,
    LoadingComponent,
    RouterLink,
    CopyInputComponent,
    AsyncPipe,
    ContributorAvatarComponent,
    MultiDateComponent
  ],
  styleUrls: [
    '../../../../../getting-started/academy/lesson/lesson-content-styling.scss',
    '../../../../../../shared/components/popup/layouts/widget.scss',
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
   * @param activatedRoute
   * @param router
   */
  constructor(
    @Inject('POPUP_DATA') protected popupReference: PopupReference,
    protected projectService: ProjectService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router
  ) {
    this.project = popupReference.data['project'];

    this.projectService.loadReadme(this.project()).pipe(
      tap((contents) => {
        this.readme.set(contents.toString());
        this.loading.set(LoadingState.LOAD_SUCCESS);
      }),
      catchError(error => {
        this.loading.set(LoadingState.LOAD_FAILURE);
        return of(error)
      }),
      take(1)
    ).subscribe()
  }

  /**
   * Called when a user clicks a tag.
   */
  protected onTagClicked(tag: string) {
    const tagFilter = new UITagGroup('tags');
    tagFilter.add(tag, true);

    this.router.navigate(['/ecosystem/projects'], {
      relativeTo: this.activatedRoute,
      queryParams: FilterManager.convertFiltersToParams([tagFilter])
    }).then();
  }
}
