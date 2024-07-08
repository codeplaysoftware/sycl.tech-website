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
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ContainerComponent } from '../../../shared/components/filter-result-layout/container/container.component';
import { ProjectWidgetComponent, ProjectWidgetLayout } from './shared/project-widget/project-widget.component';
import { FilterableBaseComponent } from '../../../shared/components/filter-result-layout/filterable-base-component.service';
import { Meta, Title } from '@angular/platform-browser';
import { ProjectService } from '../../../shared/services/models/project.service';
import { SearchablePage } from '../../../shared/components/site-wide-search/SearchablePage';
import { SideBarComponent } from '../../../shared/components/filter-result-layout/side-bar/side-bar.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'st-projects',
  standalone: true,
  imports: [
    CommonModule,
    ContainerComponent,
    ProjectWidgetComponent,
    SideBarComponent
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsComponent extends FilterableBaseComponent implements SearchablePage {
  protected readonly Layout = ProjectWidgetLayout;
  protected readonly environment = environment;

  /**
   * Constructor.
   * @param projectService
   * @param titleService
   * @param meta
   */
  constructor(
    protected projectService: ProjectService,
    protected titleService: Title,
    protected meta: Meta
  ) {
    super(projectService);
    this.titleService.setTitle('Projects - Ecosystem - SYCL.tech');
    this.meta.addTag({ name: 'keywords', content: this.getKeywords().join(', ') });
    this.meta.addTag({ name: 'description', content: this.getDescription() });
  }

  /**
   * @inheritDoc
   */
  getKeywords(): string[] {
    return ['projects', 'github', 'gitlab'];
  }

  /**
   * @inheritDoc
   */
  getTitle(): string {
    return 'Projects';
  }

  /**
   * @inheritDoc
   */
  getDescription() {
    return 'A searchable and filterable list of SYCL projects from across the globe.';
  }

  /**
   * @inheritDoc
   */
  getDefaultRoutePath() {
    return '/ecosystem/projects';
  }
}
