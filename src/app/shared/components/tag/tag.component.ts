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

import { CommonModule, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

@Component({
  selector: 'st-tag',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagComponent {
  selected = model<boolean>(false);

  title = input.required<string>();
  subTitle = input<string>();
  allowSelection = input<boolean>(true);

  /**
   * Constructor.
   * @param titleCasePipe
   */
  constructor(
    protected titleCasePipe: TitleCasePipe
  ) { }

  /**
   * Called when a user clicks on a tag.
   */
  onClick() {
    if (this.allowSelection()) {
      this.selected.set(!this.selected());
    }
  }

  /**
   * Returns a nicely formatted title for a tag.
   */
  getTitle() {
    return this.titleCasePipe.transform(this.title()).toString();
  }
}
