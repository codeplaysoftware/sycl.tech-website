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
 * News model.
 */
export interface NewsModel  {
  id: string
  externalUrl: string
  title: string
  body: string
  description: string
  date: any
  thumbnail: string
  contributor: Observable<ContributorModel>
  tag: string
  permalink: string
  pinned: boolean
  tags: string[]
}
