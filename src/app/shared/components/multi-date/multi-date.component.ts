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

import { ChangeDetectionStrategy, Component, HostListener, input, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'st-multi-date',
  standalone: true,
  templateUrl: './multi-date.component.html',
  styleUrl: './multi-date.component.scss',
  imports: [
    FormsModule,
    DatePipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiDateComponent {
  /**
   * This signal represents the date that the item was added to sycl.tech.
   */
  readonly submitted = input.required<Date>();

  /**
   * This signal represents the date that the item was originally created.
   */
  readonly created = input<Date | undefined>();

  /**
   * The format to use for the date.
   */
  readonly format = input<string>('mediumDate');

  /**
   * The currently focused date.
   */
  readonly focusedDate: WritableSignal<FocusedDate> = signal(FocusedDate.SUBMITTED);

  /**
   * Called when the container is clicked.
   */
  @HostListener('click')
  onClicked() {
    if (this.focusedDate() == FocusedDate.SUBMITTED && this.created()) {
      this.focusedDate.set(FocusedDate.CREATED);
    } else if (this.focusedDate() == FocusedDate.CREATED && this.submitted()) {
      this.focusedDate.set(FocusedDate.SUBMITTED);
    } else {
      this.focusedDate.set(FocusedDate.SUBMITTED);
    }
  }

  protected readonly FocusedDate = FocusedDate;
}

enum FocusedDate {
  SUBMITTED,
  CREATED
}