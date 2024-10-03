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

import { ContributorModel } from './contributor.model';
import { Observable } from 'rxjs';

/**
 * Project model.
 */
export interface ProjectModel {
  id: string
  date: Date
  date_created: Date
  year: number
  url: string
  license: string
  license_friendly: string
  name: string
  categories: string[]
  description: string
  tags: string[]
  contributor: Observable<ContributorModel>
  repository?: RepositoryModel
}

/**
 * Repository model.
 */
export interface RepositoryModel {
  stars?: number
  owner?: {
    name: string
    url: string
  }
  cloneUrl?: string
  contributors: ContributorModel[]
}
