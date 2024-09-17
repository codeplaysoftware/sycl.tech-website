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

import { ChangeDetectionStrategy, Component, computed, Inject, Signal, WritableSignal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TagComponent } from '../../../../../shared/components/tag/tag.component';
import { MarkdownComponent } from 'ngx-markdown';
import {
  LayeredContributorAvatarsComponent
} from '../../../../../shared/components/layered-contributor-avatars/layered-contributor-avatars.component';
import { LoadingComponent } from '../../../../../shared/components/loading/loading.component';
import { RouterLink } from '@angular/router';
import { CopyInputComponent } from '../../../../../shared/components/copy-input/copy-input.component';
import { VideoModel } from '../../../../../shared/models/video.model';
import { PopupReference } from '../../../../../shared/components/popup/PopupService';
import { StateService } from '../../../../../shared/services/state.service';
import { map } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { toSignal } from '@angular/core/rxjs-interop';
import { FriendlyNamingService } from '../../../../../shared/services/friendly-naming.service';

@Component({
  selector: 'st-video-view-popup',
  standalone: true,
  templateUrl: './video-view-popup.component.html',
  imports: [
    NgOptimizedImage,
    TagComponent,
    LayeredContributorAvatarsComponent,
    MarkdownComponent,
    LoadingComponent,
    RouterLink,
    CopyInputComponent
  ],
  styleUrls: [
    '../../../../getting-started/academy/lesson/lesson-content-styling.scss',
    '../../../../../shared/components/popup/styles/common.scss',
    '../../../../../shared/components/popup/styles/side-header.scss',
    './video-view-popup.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoViewPopupComponent {
  /**
   * Signal for the current in view video.
   * @protected
   */
  protected video: WritableSignal<VideoModel>;

  /**
   * Signal to determine if cookies/storage policy is enabled or not.
   * @protected
   */
  protected cookiesEnabled: Signal<boolean | undefined>;

  /**
   * Signal for the external URL to which the video originates from.
   * @protected
   */
  protected externalUrl: Signal<string>;

  /**
   * Signal to store the embeddable URL.
   * @protected
   */
  protected embedUrl: Signal<SafeUrl | undefined>;

  /**
   * Constructor.
   * @param popupReference
   * @param stateService
   * @param sanitizer
   * @param friendlyNamingService
   */
  constructor(
    @Inject('POPUP_DATA') popupReference: PopupReference,
    private stateService: StateService,
    private sanitizer: DomSanitizer,
    private friendlyNamingService: FriendlyNamingService
  ) {
    this.video = popupReference.data['video'];

    this.externalUrl = computed(() => {
      const url = new URL(this.video().url);
      return this.friendlyNamingService.renameInString(url.hostname.replace('www.', ''));
    });

    this.embedUrl = computed(() => {
      const embedUrl = this.video().embedUrl;
      return embedUrl ? this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl) : undefined;
    });

    this.cookiesEnabled = toSignal(this.stateService.getObservable().pipe(
      map((state) => {
        return !!state.cookiesAccepted;
      })
    ));
  }
}