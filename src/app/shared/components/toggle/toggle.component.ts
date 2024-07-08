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
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'st-toggle',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './toggle.component.html',
  styleUrl: './toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToggleComponent {
  title = input<string>('');
  buttons = input<ToggleButton[]>([]);

  toggled = output<ToggleButton>();

  /**
   * Called when a user selects a button on the toggle.
   * @param button
   */
  onClick(button: ToggleButton) {
    for (const b of this.buttons()) {
      b.selected = false;
    }

    button.selected = true;
    this.toggled.emit(button);
  }
}

/**
 * Toggle button interface.
 */
export interface ToggleButton {
  icon: string
  title: string
  value: string
  selected: boolean
}
