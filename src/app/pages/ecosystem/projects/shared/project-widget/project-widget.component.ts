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

import { ChangeDetectionStrategy, Component, input, signal, WritableSignal } from '@angular/core';
import { ProjectModel } from '../../../../../shared/models/project.model';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  LayeredContributorAvatarsComponent
} from '../../../../../shared/components/layered-contributor-avatars/layered-contributor-avatars.component';
import { TruncatePipe } from '../../../../../shared/pipes/truncate.pipe';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'st-project-widget',
  standalone: true,
  templateUrl: './project-widget.component.html',
  imports: [
    CommonModule,
    NgOptimizedImage,
    LayeredContributorAvatarsComponent,
    TruncatePipe,
  ],
  styleUrl: './project-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectWidgetComponent {
  project = input.required<ProjectModel>();
  layout = input<ProjectWidgetLayout>(ProjectWidgetLayout.WIDGET);

  protected readonly Layout = ProjectWidgetLayout;
  protected readonly cloneUrlCopied: WritableSignal<boolean>;

  /**
   * Constructor.
   * @param clipboardService
   */
  constructor(
    protected clipboardService: ClipboardService
  ) {
    this.cloneUrlCopied = signal(false);
  }

  /**
   * Called when the clone button is pressed.
   * @param project
   */
  onProjectCloneClicked(project: ProjectModel) {
    if (project.repository?.cloneUrl) {
      this.clipboardService.copy(project.repository?.cloneUrl);
      this.cloneUrlCopied.set(true);

      setTimeout(() => {
        this.cloneUrlCopied.set(false);
      }, 2000);
    }
  }
}

/**
 * Layout for the widget.
 */
export enum ProjectWidgetLayout {
  WIDGET,
  ROW
}
