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

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SearchablePage } from '../../../shared/components/site-wide-search/SearchablePage';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'st-implementations',
  standalone: true,
  templateUrl: './implementations.component.html',
  styleUrl: './implementations.component.scss',
  imports: [
    NgOptimizedImage
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImplementationsComponent implements SearchablePage {
  /**
   * Constructor.
   * @param titleService
   * @param meta
   */
  constructor(
    protected titleService: Title,
    protected meta: Meta
  ) {
    this.titleService.setTitle('Implementations - Ecosystem - SYCL.tech');
    this.meta.addTag({ name: 'keywords', content: this.getKeywords().join(', ') });
    this.meta.addTag({ name: 'description', content: this.getDescription() });
  }

  /**
   * @inheritDoc
   */
  getKeywords(): string[] {
    return ['implementations', 'dpcpp', 'dpc++', 'oneapi', 'adaptivecpp'];
  }

  /**
   * @inheritDoc
   */
  getTitle(): string {
    return 'Implementations';
  }

  /**
   * @inheritDoc
   */
  getDescription() {
    return 'A page dedicated to all the SYCL implementations we are tracking. Includes oneAPI and AdaptiveCpp.';
  }

  /**
   * @inheritDoc
   */
  getDefaultRoutePath() {
    return '/ecosystem/implementations';
  }
}
