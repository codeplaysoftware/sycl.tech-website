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
import { CommonModule } from '@angular/common';
import { NewsModel } from '../../../../shared/models/news.model';
import {
  ContributorAvatarComponent
} from '../../../../shared/components/contributor-avatar/contributor-avatar.component';
import { DateDisplayComponent } from '../../../../shared/components/date-display/date-display.component';
import { TruncatePipe } from '../../../../shared/pipes/truncate.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'st-news-widget',
  standalone: true,
  imports: [
    CommonModule,
    ContributorAvatarComponent,
    DateDisplayComponent,
    TruncatePipe,
    RouterLink
  ],
  templateUrl: './news-widget.component.html',
  styleUrl: './news-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsWidgetComponent {
  readonly news = input.required<NewsModel>();
  readonly layout = input<NewsWidgetLayout>(NewsWidgetLayout.WIDGET);

  protected readonly Layout = NewsWidgetLayout;
}

/**
 * Layout for the widget.
 */
export enum NewsWidgetLayout {
  WIDGET,
  ROW,
  MINIMAL
}
