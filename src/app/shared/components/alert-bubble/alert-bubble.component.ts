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

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'st-alert-bubble',
  standalone: true,
  templateUrl: './alert-bubble.component.html',
  imports: [
    NgIf
  ],
  styleUrl: './alert-bubble.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertBubbleComponent {
  message = input<string>('Hello World!');
  icon = input<string>('notifications');
  closable = input<boolean>(true);

  clicked = output<boolean>();
  closed = output<boolean>();

  /**
   * Called when a user wishes to close the alert.
   */
  onClose() {
    this.closed.emit(true);
  }

  onClick() {
    this.clicked.emit(true);
  }
}
