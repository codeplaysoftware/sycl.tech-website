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

import { ChangeDetectionStrategy, Component, Inject, OnInit, signal, WritableSignal } from '@angular/core';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { DatePipe } from '@angular/common';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { StateService } from '../../../../shared/services/state.service';
import { tap } from 'rxjs';
import { PopupReference } from '../../../../shared/components/popup/popup.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'st-load-popup',
  standalone: true,
  templateUrl: './load-and-save-popup.component.html',
  styleUrls: [
    '../../../../shared/components/popup/layouts/side-header.scss',
    './load-and-save-popup.component.scss'
  ],
  imports: [
    LoadingComponent,
    DatePipe,
    RouterLink
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadAndSavePopupComponent implements OnInit {
  public static readonly storageKey: string = 'st-playground-saved';
  protected readonly saved: WritableSignal<SavedCode[]> = signal([]);
  protected readonly storageEnabled: WritableSignal<boolean> = signal(false);

  /**
   * Constructor.
   * @param popupReference
   * @param storageService
   * @param stateService
   */
  constructor(
    @Inject('POPUP_DATA') protected popupReference: PopupReference,
    @Inject(LOCAL_STORAGE) protected storageService: StorageService,
    protected stateService: StateService
  ) { }

  /**
   * @inheritDoc
   */
  ngOnInit(): void {
    this.stateService.getObservable().pipe(
      tap((state) => {
        this.storageEnabled.set(state.cookiesAccepted == true);

        if (this.storageService.has(LoadAndSavePopupComponent.storageKey)) {
          const saved = this.storageService.get(LoadAndSavePopupComponent.storageKey);
          this.saved.set(saved.reverse());
        }
      }
    )).subscribe();
  }

  /**
   * Called when a user presses the save button.
   */
  onSave() {
    const saved = this.saved();

    saved.push({
      date: new Date(),
      code: this.popupReference.data['code']
    });

    this.save(saved);
  }

  /**
   * Called when the user wishes to close the popup window.
   */
  onClose() {
    this.popupReference.close();
  }

  /**
   * Called when a user chooses to load a save code item.
   * @param savedItem
   */
  onLoadSaved(savedItem: SavedCode) {
    this.popupReference.close(savedItem);
  }

  /**
   * Called when a user wishes to delete a saved code item.
   * @param savedItem
   */
  onDeleteSaved(savedItem: SavedCode) {
    const saved = this.saved().filter((currentSavedItem) => {
      if (currentSavedItem.date == savedItem.date && currentSavedItem.code == savedItem.code) {
        return null;
      }

      return currentSavedItem;
    });

    this.save(saved);
  }

  /**
   * Save an item to the browser storage.
   * @param itemsToSave
   */
  private save(itemsToSave: SavedCode[]) {
    this.saved.set(itemsToSave);

    if (itemsToSave.length == 0) {
      this.storageService.remove(LoadAndSavePopupComponent.storageKey);
      return ;
    }

    this.storageService.set(LoadAndSavePopupComponent.storageKey, itemsToSave);
  }
}

/**
 * Represents a save code item.
 */
export interface SavedCode {
  date: Date
  code: string
}