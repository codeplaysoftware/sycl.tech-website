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
import { ChangeDetectionStrategy, Component, HostListener, input, model, output } from '@angular/core';

@Component({
  selector: 'st-switch',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SwitchComponent {
  checked = model<boolean>(false);
  enabled = model<boolean>(true);

  title = input<string>('Click to toggle');
  iconOn = input<string>('check');
  iconOff = input<string>('close');

  clicked = output();

  /**
   * Called when a user clicks on any part of the switch.
   */
  @HostListener('click', ['$event'])
  onClick() {
    this.clicked.emit();

    if (!this.enabled()) {
      return ;
    }

    this.checked.set(!this.checked());
  }
}
