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
import { Component, input, model, signal, WritableSignal } from '@angular/core';
import { SearchComponent } from '../../search/search.component';
import { FilterGroup, ResultFilter } from '../../../managers/ResultFilterManager';
import { TagComponent } from '../../tag/tag.component';

@Component({
  selector: 'st-filter-side-bar',
  standalone: true,
  imports: [
    CommonModule,
    SearchComponent,
    TagComponent
  ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {
  readonly filterGroups = model<FilterGroup[]>([]);
  readonly collectionName = input.required<string>();
  readonly newCollectionItemUrl = input.required<string>();
  readonly hideFilters: WritableSignal<boolean> = signal(true);

  protected readonly FilterGroup = FilterGroup;

  /**
   * Called when any of the filters have changed.
   */
  onFiltersChanged() {
    // Need to reassign for CD to pick up the changes
    this.filterGroups.set(this.filterGroups().slice())
  }

  /**
   * Get a subtitle for a filter.
   * @param filter
   */
  getSubTitle(filter: ResultFilter) {
    if (filter.extras && 'subTitle' in filter.extras) {
      return filter.extras['subTitle'].slice(0, -1);
    }

    return undefined;
  }

  /**
   * Called when a user presses the mobile "show filters" button.
   */
  onMobileMenuClicked() {
    this.hideFilters.set(!this.hideFilters());
  }
}
