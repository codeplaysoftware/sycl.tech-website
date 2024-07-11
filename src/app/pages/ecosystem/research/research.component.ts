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
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ContainerComponent } from '../../../shared/components/filter-result-layout/container/container.component';
import { ResearchService } from '../../../shared/services/models/research.service';
import { FilterableBaseComponent } from '../../../shared/components/filter-result-layout/filterable-base-component.service';
import { ResearchWidgetComponent, ResearchWidgetLayout } from './shared/research-widget/research-widget.component';
import { Meta, Title } from '@angular/platform-browser';
import { SearchablePage } from '../../../shared/components/site-wide-search/SearchablePage';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'st-research',
  standalone: true,
  imports: [
    CommonModule,
    ContainerComponent,
    ResearchWidgetComponent
  ],
  templateUrl: './research.component.html',
  styleUrl: './research.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResearchComponent extends FilterableBaseComponent implements OnInit, SearchablePage {
  protected readonly Layout = ResearchWidgetLayout;
  protected readonly environment = environment;

  /**
   * Constructor.
   * @param researchService
   * @param titleService
   * @param meta
   */
  constructor(
    protected researchService: ResearchService,
    protected titleService: Title,
    protected meta: Meta
  ) {
    super(researchService);

    this.maxResultsPerPage = 20;

    this.titleService.setTitle('Research - Ecosystem - SYCL.tech');
    this.meta.addTag({ name: 'keywords', content: this.getKeywords().join(', ') });
    this.meta.addTag({ name: 'description', content: this.getDescription() });
  }

  /**
   * @inheritDoc
   */
  getKeywords(): string[] {
    return ['research', 'papers', 'pdf'];
  }

  /**
   * @inheritDoc
   */
  getTitle(): string {
    return 'Research Papers';
  }

  /**
   * @inheritDoc
   */
  getDescription() {
    return 'A searchable and filterable list of SYCL research papers from across the globe.';
  }

  /**
   * @inheritDoc
   */
  getDefaultRoutePath() {
    return '/ecosystem/research';
  }
}
