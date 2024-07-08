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
import { ChangeDetectionStrategy, Component, computed, input, output, Signal } from '@angular/core';
import { ContributorModel } from '../../models/contributor.model';
import { ContributorAvatarComponent } from '../contributor-avatar/contributor-avatar.component';

@Component({
  selector: 'st-layered-contributor-avatars',
  standalone: true,
  imports: [
    CommonModule,
    ContributorAvatarComponent
  ],
  templateUrl: './layered-contributor-avatars.component.html',
  styleUrl: './layered-contributor-avatars.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayeredContributorAvatarsComponent {
  contributors = input.required<ContributorModel[]>();
  limit = input<number>(6);

  clicked = output<ContributorModel>();

  limitedContributors: Signal<ContributorModel[]>;
  isLimited: Signal<boolean>;

  /**
   * Constructor.
   */
  constructor() {
    this.limitedContributors = computed(
      () => this.contributors().slice(0, this.limit()));

    this.isLimited = computed(
      () => this.contributors().length > this.limit());
  }

  /**
   * @param contributorModel
   */
  onContributorClicked(contributorModel: ContributorModel) {
    this.clicked.emit(contributorModel);
  }
}
