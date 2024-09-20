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

import { ChangeDetectionStrategy, Component, HostListener, input } from '@angular/core';
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
  readonly submitted = input<Date | undefined>();

  /**
   * This signal represents the date that the item was originally created.
   */
  readonly created = input<Date | undefined>();

  /**
   * The format to use for the date.
   */
  readonly format = input<string>('mediumDate');

  /**
   * Called when the container is clicked.
   */
  @HostListener('click')
  onClicked() {
    alert('Added to SYCL.tech on ' + this.submitted() + ' and originally published on ' + this.created());
  }
}
