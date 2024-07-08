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

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  ContributorAvatarComponent
} from '../../../../../shared/components/contributor-avatar/contributor-avatar.component';
import { ResearchModel } from '../../../../../shared/models/research.model';
import { TruncatePipe } from '../../../../../shared/pipes/truncate.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'st-research-widget',
  standalone: true,
  imports: [
    CommonModule,
    ContributorAvatarComponent,
    TruncatePipe,
  ],
  templateUrl: './research-widget.component.html',
  styleUrl: './research-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResearchWidgetComponent {
  research = input.required<ResearchModel>();
  layout = input<ResearchWidgetLayout>(ResearchWidgetLayout.WIDGET);

  protected readonly Layout = ResearchWidgetLayout;
}

/**
 * Layout for the widget.
 */
export enum ResearchWidgetLayout {
  WIDGET,
  ROW
}
