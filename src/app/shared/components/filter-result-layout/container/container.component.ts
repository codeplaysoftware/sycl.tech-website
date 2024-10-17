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
import { Component, input, model, output } from '@angular/core';
import { SearchComponent } from '../../search/search.component';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { HeaderComponent } from '../header/header.component';
import { LoadingComponent } from '../../loading/loading.component';
import { LoadingState } from '../../../LoadingState';
import { ToggleButton } from '../../toggle/toggle.component';
import { ShowMoreComponent } from '../../show-more/show-more.component';
import { UIFilter } from '../FilterManager';

@Component({
  selector: 'st-filter-container',
  standalone: true,
  imports: [
    CommonModule,
    SearchComponent,
    SideBarComponent,
    HeaderComponent,
    LoadingComponent,
    ShowMoreComponent
  ],
  templateUrl: './container.component.html',
  styleUrl: './container.component.scss'
})
export class ContainerComponent {
  readonly filterGroups = model<UIFilter[]>([]);
  readonly collectionName = input<string>('Resource');
  readonly totalResultCount = input<number>(0);
  readonly filteredResultCount = input<number>(0);
  readonly visibleResultCount = input<number>(0);
  readonly state = input<LoadingState>(LoadingState.LOADING);
  readonly newCollectionItemUrl = input.required<string>();
  readonly toggleButtons = input<ToggleButton[]>([
    {
      icon: 'grid_view',
      title: 'Grid View',
      value: 'grid',
      selected: true
    },
    {
      icon: 'list',
      title: 'View View',
      value: 'list',
      selected: false
    }
  ]);

  readonly toggleButtonsChange = output<ToggleButton>();
  readonly viewMore = output<boolean>();
  readonly LoadingState = LoadingState;

  /**
   * Called when the user wishes to change the layout.
   * @param toggleButton
   */
  onViewToggleChanged(
    toggleButton: ToggleButton
  ) {
    this.toggleButtonsChange.emit(toggleButton);
  }

  /**
   * Called when the user wishes to view more items.
   */
  onViewMore() {
    this.viewMore.emit(true);
  }
}
