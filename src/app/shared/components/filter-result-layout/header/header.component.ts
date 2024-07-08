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
import { ToggleButton, ToggleComponent } from '../../toggle/toggle.component';

@Component({
  selector: 'st-filter-container-header',
  standalone: true,
  imports: [
    ToggleComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  readonly totalResultCount = input<number>(0);
  readonly filteredResultCount = input<number>(0);
  readonly visibleResultCount = input<number>(0);
  readonly toggleButtons = input<ToggleButton[]>([]);
  readonly toggleButtonSelected = output<ToggleButton>();

  /**
   * Called when a toggle button has been toggled.
   * @param toggleButton
   */
  onViewToggleChanged(toggleButton: ToggleButton) {
    this.toggleButtonSelected.emit(toggleButton);
  }
}
