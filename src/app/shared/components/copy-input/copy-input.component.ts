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

import { ChangeDetectionStrategy, Component, model, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'st-copy-input',
  standalone: true,
  templateUrl: './copy-input.component.html',
  styleUrl: './copy-input.component.scss',
  imports: [
    FormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CopyInputComponent {
  readonly content = model<string>('');
  readonly title = model<string>('');
  readonly copied: WritableSignal<boolean> = signal(false);

  /**
   * Constructor.
   * @param clipboardService
   */
  constructor(
    protected clipboardService: ClipboardService
  ) { }

  /**
   * Called when the user presses the copy button.
   */
  onCopy() {
    this.clipboardService.copy(this.content());

    this.copied.set(true);

    setTimeout(() => {
      this.copied.set(false);
    }, 1500);
  }
}
