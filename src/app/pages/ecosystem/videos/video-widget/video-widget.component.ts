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
import { VideoModel } from '../../../../shared/models/video.model';
import {
  ContributorAvatarComponent
} from '../../../../shared/components/contributor-avatar/contributor-avatar.component';
import { TruncatePipe } from '../../../../shared/pipes/truncate.pipe';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { VideoViewPopupComponent } from './video-view-popup/video-view-popup.component';
import { PopupService } from '../../../../shared/components/popup/popup.service';

@Component({
  selector: 'st-video-widget',
  standalone: true,
  imports: [
    CommonModule,
    ContributorAvatarComponent,
    TruncatePipe,
    NgOptimizedImage
  ],
  templateUrl: './video-widget.component.html',
  styleUrl: './video-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoWidgetComponent {
  video = input.required<VideoModel>();
  layout = input<VideoWidgetLayout>(VideoWidgetLayout.WIDGET);

  protected readonly Layout = VideoWidgetLayout;

  constructor(
    protected popupService: PopupService
  ) { }

  /**
   * Get featuring info.
   * @param video
   */
  getFeaturingInfo(video: VideoModel) {
    if (video.featuring === undefined || video.featuring.length == 0) {
      return '';
    }

    if (video.featuring.length == 1) {
      return `Featuring ${video.featuring[0].name}.`;
    }

    return video.featuring.reduce(function (result, item) {
      if (result.length > 0) {
        return `${result} ${item.name},`;
      }

      return item.name;
    }, 'Featuring ').slice(0, -1) + '.';
  }

  /**
   * Called when a user clicks on a video
   */
  onVideoClicked() {
    this.popupService.create(VideoViewPopupComponent, {
      'video': this.video
    }, true);
  }
}

/**
 * Layout for the widget.
 */
export enum VideoWidgetLayout {
  WIDGET,
  ROW
}
