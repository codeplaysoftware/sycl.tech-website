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

import { ChangeDetectionStrategy, Component, ElementRef, input, model, output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'st-search',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent {
  value = model<string>('');
  placeholder = input<string>('type to search');

  keyDown = output<KeyboardEvent>();

  @ViewChild('search')
  searchElement: ElementRef | undefined;

  /**
   * Call via @ViewChild, you can focus the input element by calling this function.
   */
  focus() {
    if (this.searchElement) {
      this.searchElement.nativeElement.focus();
    }
  }

  /**
   * Called on keydown.
   * @param e
   */
  onKeyDown(e: KeyboardEvent) {
    this.keyDown.emit(e)
  }
}
