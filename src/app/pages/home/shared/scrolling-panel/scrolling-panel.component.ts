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

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, input, NgZone, OnChanges } from '@angular/core';
import { PlatformService } from '../../../../shared/services/platform.service';
import { PinnedModel } from '../../../../shared/models/pinned.model';
import { TruncatePipe } from '../../../../shared/pipes/truncate.pipe';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'st-scrolling-panel',
  standalone: true,
  imports: [
    CommonModule,
    TruncatePipe,
    LoadingComponent,
    RouterLink
  ],
  templateUrl: './scrolling-panel.component.html',
  styleUrls: [
    '../../sub-panel-styling.scss',
    './scrolling-panel.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollingPanelComponent implements OnChanges {
  /**
   * The pins to use to generate panels from.
   */
  pins = input<PinnedModel[]>([]);

  /**
   * The time between panel slides.
   * @protected
   */
  protected timeBetween = 6000;

  /**
   * The pins in the dom.
   * @protected
   */
  protected renderPins: PinnedModel[] = [];

  /**
   * Spacer panel.
   * @protected
   */
  protected spacerPanel: PinnedModel | null = null;

  /**
   * Current position of the pins.
   * @protected
   */
  protected pinPosition = 0;

  /**
   * Animation timer, should match animation length in .scss file.
   * @protected
   */
  protected animationTimer: any = null;

  /**
   * Timer used to show the next slide.
   * @protected
   */
  protected nextRunTimer: any = null;

  /**
   * Is the scrolling paused or not.
   * @protected
   */
  protected paused: boolean = false;

  /**
   * Constructor.
   * @param platformService
   * @param ngZone
   * @param changeDetectorRef
   */
  constructor(
    protected platformService: PlatformService,
    protected ngZone: NgZone,
    protected changeDetectorRef: ChangeDetectorRef
  ) { }

  /**
   * @inheritDoc
   */
  ngOnChanges() {
    if (this.pins().length > 0) {
      this.reload();
    }
  }

  /**
   * Reload the available panels.
   */
  reload() {
    const pins = this.pins();
    this.renderPins = [];

    if (pins.length > 0) {
      this.renderPins.push(pins[0]);
    }

    this.spacerPanel = this.renderPins[0];

    if (pins.length >= 2) {
      this.ngZone.runOutsideAngular(() => {
        if (this.platformService.isClient()) {
          this.run();
        }
      });
    }
  }

  /**
   * Switch the panels.
   */
  switchPanels() {
    const pins = this.pins();
    let nextPanelIndex = this.pinPosition + 1;

    if (nextPanelIndex == pins.length) {
      nextPanelIndex = 0;
    }

    this.renderPins = [];
    this.renderPins.push(pins[this.pinPosition]);
    this.renderPins.push(pins[nextPanelIndex]);

    if (this.pinPosition == pins.length - 1) {
      this.pinPosition = -1;
    }

    this.spacerPanel = this.renderPins[1];
  }

  /**
   * Run loop.
   */
  run() {
    this.clearTimer();

    this.nextRunTimer = setTimeout(() => {
      this.switchPanels();
      this.changeDetectorRef.detectChanges();

      this.pinPosition = this.pinPosition + 1;
      this.run();
    }, this.timeBetween);
  }

  /**
   * Clear any timers.
   */
  clearTimer() {
    if (this.nextRunTimer) {
      clearTimeout(this.nextRunTimer);
    }

    if (this.animationTimer) {
      clearTimeout(this.animationTimer);
    }
  }

  /**
   * Pause the panel if the user hovers the panel.
   */
  onMouseEnter() {
    this.paused = true;
    this.clearTimer();
  }

  /**
   * Restart the looping if the user leaves the panel.
   */
  onMouseLeave() {
    this.paused = false;
    this.run();
  }
}
