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

import { Injectable } from '@angular/core';
import { PlaygroundSampleModel } from '../../models/playground-sample.model';
import { environment } from '../../../../environments/environment';
import { ContributorService } from './contributor.service';
import { JsonFeedService } from '../json-feed.service';
import { FilterGroup } from '../../managers/ResultFilterManager';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlaygroundSampleService extends JsonFeedService {
  /**
   * Constructor.
   * @param contributorService
   */
  constructor(
    protected contributorService: ContributorService
  ) {
    super(environment.json_feed_base_url + '/playground_samples/');
  }

  /**
   * @inheritDoc
   */
  convertFeedItem<PlaygroundSample>(
    feedItem: any
  ): PlaygroundSample {
    return <PlaygroundSample> {
      id: feedItem['id'],
      title: feedItem['title'],
      code: feedItem['content_text'],
      tag: feedItem['_tag'],
      cached_response: feedItem['_cached_response'] ?? undefined,
      contributor: of(ContributorService.convertFeedItem(
        feedItem['author']))
    }
  }

  /**
   * @inheritDoc
   */
  all(
    limit: number | null = null,
    offset: number = 0,
    filterGroups: FilterGroup[] = [],
  ): Observable<PlaygroundSampleModel[]> {
    return super._all<PlaygroundSampleModel>(limit, offset, filterGroups).pipe(map((f => f.items)));
  }

  /**
   * Fetch all the code samples.
   */
  getSamples(): Observable<PlaygroundSampleModel[]> {
    return this.all();
  }

  /**
   * Fetch a sample by its tag.
   * @param tag
   */
  getSampleByTag(tag: string): Observable<PlaygroundSampleModel> {
    return this.getSamples().pipe(
      map((samples) => {
        const found = samples.find(sample => sample.tag === tag);

        if (found) {
          return found;
        }

        throw Error(`No sample with tag "${tag}" found.`);
      })
    );
  }

  /**
   * Get a default sample that can be used before loading from backend.
   */
  static getDefaultSample(): PlaygroundSampleModel {
    return {
      id: '0',
      tag: 'hello-world-on-device',
      title: 'Hello World! (on device)',
      code: '#include <sycl/sycl.hpp>\n' +
        '\n' +
        'class hello_world;\n' +
        '\n' +
        'int main(int, char**) {\n' +
        '    auto device_selector = sycl::default_selector_v;\n' +
        '    \n' +
        '    sycl::queue queue(device_selector);\n' +
        '\n' +
        '    std::cout << "Running on: "\n' +
        '              << queue.get_device().get_info<sycl::info::device::name>()\n' +
        '              << "\\n";\n' +
        '    \n' +
        '    queue.submit([&] (sycl::handler& cgh) {\n' +
        '        auto os = sycl::stream{128, 128, cgh};\n' +
        '        cgh.single_task<hello_world>([=]() { \n' +
        '            os << "Hello World! (on device)\\n"; \n' +
        '        });\n' +
        '    });\n' +
        '    \n' +
        '    return 0;\n' +
        '}\n',
      contributor: of(ContributorService.getAnonymousContributor())
    }
  }
}
