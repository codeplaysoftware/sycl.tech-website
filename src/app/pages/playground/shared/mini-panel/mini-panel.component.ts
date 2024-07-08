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

import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';

@Component({
  selector: 'st-mini-panel',
  standalone: true,
  imports: [
    CommonModule,
    LoadingComponent,
    NgOptimizedImage
  ],
  templateUrl: './mini-panel.component.html',
  styleUrl: './mini-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MiniPanelComponent {
  readonly viewState = model<PanelViewState>(PanelViewState.NORMAL);
  readonly actionButtons = model<ActionButton[]>([]);

  readonly tag = input<string | undefined>(undefined);
  readonly title = input<string>('Untitled');
  readonly icon = input<string>('code');
  readonly state = input<MiniPanelState>(MiniPanelState.SHOWING);

  actionButtonClicked = output<ActionButton>();

  protected readonly MiniPanelState = MiniPanelState;
  protected readonly PanelViewState = PanelViewState;

  /**
   * Called when the user clicks on one of the action buttons.
   * @param actionButton
   */
  onActionButtonClicked(actionButton: ActionButton) {
    this.actionButtons.set(this.actionButtons());
    this.actionButtonClicked.emit(actionButton);
  }

  /**
   * Called when the user has changed the view state of the panel.
   * @param viewState
   */
  onSetViewState(viewState: PanelViewState) {
    this.viewState.set(viewState);
  }
}

/**
 * Action button interface.
 */
export interface ActionButton {
  name: string
  title: string
  icon: string
  disabled?: boolean
  active?: boolean
}

/**
 * Panel render state.
 */
export enum MiniPanelState {
  LOADING,
  EMPTY,
  SHOWING
}

/**
 * Panel view state.
 */
export enum PanelViewState {
  NORMAL,
  MAXIMIZED,
  MINIMIZED,
  HIDDEN
}
