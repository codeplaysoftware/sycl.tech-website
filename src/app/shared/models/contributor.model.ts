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

/**
 * Contributor model.
 */
export interface ContributorModel {
  name: string
  username: string
  bio?: string
  avatar: string
  date: Date
  links: SocialModel[]
  position: string
  affiliation: string
  contribution_counts: {
    news: number
    videos: number
    projects: number
    researchPapers: number
    events: number
  }
}

/**
 * Social model.
 */
export interface SocialModel {
  name: string
  url: string
  tag: string
}
