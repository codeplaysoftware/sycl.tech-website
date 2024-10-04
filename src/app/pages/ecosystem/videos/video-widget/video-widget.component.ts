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

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  input,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { VideoModel } from '../../../../shared/models/video.model';
import {
  ContributorAvatarComponent
} from '../../../../shared/components/contributor-avatar/contributor-avatar.component';
import { TruncatePipe } from '../../../../shared/pipes/truncate.pipe';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { VideoViewPopupComponent } from './video-view-popup/video-view-popup.component';
import { PopupService } from '../../../../shared/components/popup/popup.service';
import { SafeStorageService } from '../../../../shared/services/safe-storage.service';
import { Subscription, tap } from 'rxjs';
import { SafeUrl } from '@angular/platform-browser';

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
export class VideoWidgetComponent implements OnInit, OnDestroy {
  video = input.required<VideoModel>();
  layout = input<VideoWidgetLayout>(VideoWidgetLayout.WIDGET);

  protected storageSubscription: Subscription | undefined;
  protected readonly Layout = VideoWidgetLayout;

  /**
   * Constructor.
   * @param popupService
   * @param safeStorageService
   * @param changeDetectorRef
   */
  constructor(
    protected popupService: PopupService,
    protected safeStorageService: SafeStorageService,
    protected changeDetectorRef: ChangeDetectorRef
  ) { }

  /**
   * @inheritdoc
   */
  ngOnInit() {
    this.storageSubscription = this.safeStorageService.observe()
      .pipe(
        tap(() => {
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }

  /**
   * @inheritdoc
   */
  ngOnDestroy() {
    this.storageSubscription?.unsubscribe();
  }

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

  getVideoProviderImage(video: VideoModel): SafeUrl | undefined {
    let color = 'black';

    if (this.safeStorageService.get('st-dark-mode-enabled') == true) {
      color = 'white';
    }

    switch (video.provider) {
      case 'youtube.com': {
        return `./assets/images/ecosystem/videos/providers/youtube-${color}.svg`;
      }
    }

    return undefined;
  }
}

/**
 * Layout for the widget.
 */
export enum VideoWidgetLayout {
  WIDGET,
  ROW
}
