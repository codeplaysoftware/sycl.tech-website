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

/**
 * Implementation activity model.
 */
export interface ImplementationActivityModel {
  title: string
  type: ImplementationActivityType
  contributor: ContributorModel
  url: string
  date: Date
  repository: string
}

/**
 * Implementation activity type.
 */
export enum ImplementationActivityType {
  COMMIT,
  RELEASE
}
