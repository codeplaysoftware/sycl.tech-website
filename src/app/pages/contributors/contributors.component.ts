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

import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { ContributorService } from '../../shared/services/models/contributor.service';
import { ContributorModel } from '../../shared/models/contributor.model';
import { ContributorAvatarComponent } from '../../shared/components/contributor-avatar/contributor-avatar.component';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'st-contributors',
  standalone: true,
  imports: [
    CommonModule,
    ContributorAvatarComponent,
    RouterLink,
  ],
  templateUrl: './contributors.component.html',
  styleUrl: './contributors.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContributorsComponent {
  protected readonly contributors: Signal<ContributorModel[]>;

  /**
   * Constructor.
   * @param contributorsService
   * @param titleService
   */
  constructor(
    protected contributorsService: ContributorService,
    protected titleService: Title
  ) {
    this.titleService.setTitle('Contributors - SYCL.tech');
    this.contributors = toSignal(this.contributorsService.all(), { initialValue: [] });
  }
}
