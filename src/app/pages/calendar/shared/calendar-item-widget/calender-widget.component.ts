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
import {
  ContributorAvatarComponent
} from '../../../../shared/components/contributor-avatar/contributor-avatar.component';
import { DateDisplayComponent } from '../../../../shared/components/date-display/date-display.component';
import { TruncatePipe } from '../../../../shared/pipes/truncate.pipe';
import { RouterLink } from '@angular/router';
import { EventModel } from '../../../../shared/models/event.model';
import {
  LayeredContributorAvatarsComponent
} from '../../../../shared/components/layered-contributor-avatars/layered-contributor-avatars.component';

@Component({
  selector: 'st-calendar-item-widget',
  standalone: true,
  imports: [
    CommonModule,
    ContributorAvatarComponent,
    DateDisplayComponent,
    TruncatePipe,
    RouterLink,
    LayeredContributorAvatarsComponent
  ],
  templateUrl: './calender-widget.component.html',
  styleUrl: './calender-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalenderWidgetComponent {
  protected readonly CalendarWidgetLayout = CalendarWidgetLayout;

  readonly event = input.required<EventModel>();
  readonly layout = input<CalendarWidgetLayout>(CalendarWidgetLayout.WIDGET);
}

/**
 * Layout for the widget.
 */
export enum CalendarWidgetLayout {
  WIDGET
}
