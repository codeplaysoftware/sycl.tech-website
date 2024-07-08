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

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ContributorModel } from '../../models/contributor.model';
import { Router } from '@angular/router';

@Component({
  selector: 'st-contributor-avatar',
  standalone: true,
  templateUrl: './contributor-avatar.component.html',
  styleUrl: './contributor-avatar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContributorAvatarComponent {
  contributor = input.required<ContributorModel>();

  clicked = output<ContributorModel>();

  /**
   * Constructor.
   * @param router
   */
  constructor(
    protected router: Router
  ) { }

  /**
   * Called when a user clicks on the avatar.
   */
  onContributorClicked() {
    this.clicked.emit(this.contributor());

    this.router.navigateByUrl(`/contributors/${this.contributor().username}`)
      .then(() => null);
  }
}
