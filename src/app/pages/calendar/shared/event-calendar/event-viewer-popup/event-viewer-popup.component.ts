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

import { ChangeDetectionStrategy, Component, Inject, signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LayeredContributorAvatarsComponent
} from '../../../../../shared/components/layered-contributor-avatars/layered-contributor-avatars.component';
import { PopupReference } from '../../../../../shared/components/popup/PopupService';
import { CalendarItemModel } from '../models/calendar-item.model';
import { ContributorModel } from '../../../../../shared/models/contributor.model';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'st-event-viewer-popup',
  standalone: true,
  imports: [
    CommonModule,
    LayeredContributorAvatarsComponent
  ],
  templateUrl: './event-viewer-popup.component.html',
  styleUrl: './event-viewer-popup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventViewerPopupComponent {
  protected readonly environment = environment;
  protected calendarItem: Signal<CalendarItemModel>;

  /**
   * Constructor.
   * @param popupReference
   */
  constructor(
    @Inject('POPUP_DATA') protected popupReference: PopupReference
  ) {
    this.calendarItem = signal(this.popupReference.data);
  }

  /**
   * Called when an attendee is clicked.
   * @param $event
   */
  onContributorClicked($event: ContributorModel) {
    this.popupReference.close($event);
  }
}
