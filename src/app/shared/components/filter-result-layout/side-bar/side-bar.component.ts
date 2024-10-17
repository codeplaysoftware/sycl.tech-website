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
import { TagComponent } from '../../tag/tag.component';
import { UIFilter, UISearchFilter, UITagGroup } from '../FilterManager';

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
  /**
   * Model for an array of UIFilter.
   */
  readonly filters = model<UIFilter[]>([]);

  /**
   * Required input signal for name of the collection this sidebar is rendering.
   */
  readonly collectionName = input.required<string>();

  /**
   * Required input signal for a URL to add a new item to the collection this sidebar is rendering.
   */
  readonly newCollectionItemUrl = input.required<string>();

  /**
   * Signal to hide or show the filters.
   */
  readonly hideFilters: WritableSignal<boolean> = signal(true);

  /**
   * Provides the UISearchFilter type to the template.
   * @protected
   */
  protected readonly UIFilterGroup = UISearchFilter;

  /**
   * Provides the UITagGroup type to the template.
   * @protected
   */
  protected readonly UITagGroup = UITagGroup;

  /**
   * Called when any of the filters have changed.
   */
  onFiltersChanged() {
    // Need to reassign for CD to pick up the changes
    this.filters.set(this.filters().slice())
  }

  /**
   * Checks if the value of check is an instance of against.
   * @param check
   * @param against
   */
  instanceOf(check: any, against: any): boolean {
    return check instanceof against;
  }

  /**
   * Converts the type of filter into a UITagGroup for the template.
   * @param filter
   */
  castToUITagGroup(filter: UIFilter): UITagGroup {
    return (filter as UITagGroup);
  }

  /**
   * Converts the type of filter into a UISearchFilter for the template.
   * @param filter
   */
  castToUISearchFilter(filter: UIFilter): UISearchFilter {
    return (filter as UISearchFilter);
  }

  /**
   * Called when a user presses the mobile "show filters" button.
   */
  onMobileMenuClicked() {
    this.hideFilters.set(!this.hideFilters());
  }
}
