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

import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, signal, Signal, WritableSignal } from '@angular/core';
import { ContributorModel } from '../../../shared/models/contributor.model';
import { ContributorService } from '../../../shared/services/models/contributor.service';
import { ActivatedRoute } from '@angular/router';
import { ContributorAvatarComponent } from '../../../shared/components/contributor-avatar/contributor-avatar.component';
import { Title } from '@angular/platform-browser';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { LoadingState } from '../../../shared/LoadingState';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

@Component({
  selector: 'st-contributors-view',
  standalone: true,
  imports: [
    CommonModule,
    ContributorAvatarComponent,
    LoadingComponent,
    NgOptimizedImage
  ],
  templateUrl: './contributor.component.html',
  styleUrl: './contributor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContributorComponent {
  protected readonly LoadingState = LoadingState;
  protected readonly contributor: Signal<ContributorModel | null>;
  protected readonly state: WritableSignal<LoadingState> = signal(LoadingState.LOADING);

  /**
   * Constructor.
   * @param contributorsService
   * @param activatedRoute
   * @param titleService
   */
  constructor(
    protected contributorsService: ContributorService,
    protected activatedRoute: ActivatedRoute,
    protected titleService: Title
  ) {
    const observable = this.contributorsService.getContributorByUsername2(
      this.activatedRoute.snapshot.params['username']).pipe(
        tap(() => this.state.set(LoadingState.LOAD_SUCCESS))
    )

    this.contributor = toSignal(observable, { initialValue: null });

    effect(() => {
      this.titleService.setTitle(this.contributor()?.name + ' - Contributors - SYCL.tech');
    })
  }
}
