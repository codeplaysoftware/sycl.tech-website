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
import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ContentChildren, model, OnChanges, QueryList, signal, WritableSignal,
} from '@angular/core';
import { TabComponent } from './tab/tab.component';

@Component({
  selector: 'st-tabs',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsComponent implements AfterViewInit, OnChanges {
  @ContentChildren(TabComponent)
  protected readonly tabsPanes!: QueryList<TabComponent>;
  protected readonly tabs: WritableSignal<Tab[]> = signal([]);

  readonly selectedTabName = model<string>();

  /**
   * Constructor.
   * @param changeDetectorRef
   */
  constructor(protected changeDetectorRef: ChangeDetectorRef) {

  }

  /**
   * @inheritDoc
   */
  ngAfterViewInit() {
    for (const viewChild of this.tabsPanes) {
      this.tabs().push({
        name: viewChild.name(),
        selected: false,
        tab: viewChild
      });
    }

    this.ngOnChanges();
    this.changeDetectorRef.detectChanges();
  }

  /**
   * @inheritDoc
   */
  ngOnChanges() {
    if (this.tabs().length == 0) {
      return ;
    }

    let selectedTabName = this.selectedTabName();

    if (selectedTabName === undefined) {
      this.setSelectedTab(this.tabs()[0]);
      return ;
    }

    const tabName = this.getTabByName(selectedTabName);

    if (tabName == undefined) {
      return ;
    }

    this.setSelectedTab(tabName);
  }

  /**
   * Get a tab by its index.
   * @param name
   */
  getTabByName(name: string) {
    name = name.toLowerCase();

    for (const tab of this.tabs()) {
      if (tab.name.toLowerCase() == name) {
        return tab;
      }
    }

    return undefined;
  }

  /**
   * Clear the tab selection.
   */
  clearTabSelection() {
    for (const tab of this.tabs()) {
      tab.selected = false;
      tab.tab.selected.set(false);
    }
  }

  /**
   * Set the selected tab.
   * @param tab
   */
  setSelectedTab(tab: Tab) {
    this.clearTabSelection();
    tab.selected = true;
    tab.tab.selected.set(true);
    this.selectedTabName.set(tab.name);
  }

  /**
   * Called when a user selects a tab.
   * @param tab
   */
  onTabClicked(tab: Tab) {
    this.setSelectedTab(tab);
  }
}

/**
 * Interface to internally tracking tabs.
 */
interface Tab {
  name: string
  selected?: boolean
  tab: TabComponent
}
