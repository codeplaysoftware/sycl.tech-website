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
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import Convert from 'ansi-to-html';
import { CompilationResultModel } from '../../models/compilation-result.model';
import { PlaygroundSampleModel } from '../../models/playground-sample.model';

@Injectable({
  providedIn: 'root'
})
export class PlaygroundService {
  /**
   * Compiler explorer compiler endpoint.
   * @protected
   */
  protected readonly compilerExplorer: string = 'https://godbolt.org/api/compiler/icx202400/compile';
  protected readonly sampleSubject: BehaviorSubject<PlaygroundSampleModel | undefined>;

  /**
   * Constructor.
   * @param httpClient
   * @param domSanitizer
   */
  constructor(
    protected httpClient: HttpClient,
    protected domSanitizer: DomSanitizer
  ) {
    this.sampleSubject = new BehaviorSubject<PlaygroundSampleModel | undefined>(undefined);
  }

  /**
   * Set the current sample.
   * @param sample
   */
  setSample(
    sample: PlaygroundSampleModel
  ) {
    this.sampleSubject.next(sample);
  }

  /**
   * Get the current selected sample.
   */
  getSample(): Observable<PlaygroundSampleModel | undefined> {
    return this.sampleSubject;
  }

  /**
   * Clear the current sample.
   */
  clearSample() {
    this.sampleSubject.next(undefined);
  }

  /**
   * Compile code using compiler explorer API and return a result.
   * @param code
   */
  compile(
    code: string
  ): Observable<CompilationResultModel> {
    if (code.length < 10) {
      throw new Error('Minimum code length is 10 characters.');
    }

    // Prepare a response from the compilation result.
    const compileResponse: CompilationResultModel = PlaygroundService.getEmptyResult();

    // Send our code to compiler explorer backend
    return this.httpClient.post<any>(
      this.compilerExplorer, PlaygroundService.wrapRequest(code))
      .pipe(
        map(response => {
          // Load assembly
          if (response['asm'] && response['asm'].length > 0) {
            compileResponse.assembly = response['asm'].map((line: any) => {
              return line['text'];
            }).join('\n');
          }

          if (response['execResult']
            && response['execResult']['stdout']
            && response['execResult']['stdout'].length > 0) {
            compileResponse.result = response['execResult']['stdout'].map((line: any) => {
              if (line['text'].startsWith('Running on:')) {
                compileResponse.platform = line['text'].replace('Running on:', '').trim();
                return null;
              }

              return line['text'];
            }).filter((l: any) => l).join('\n');
          } else {
            compileResponse.error = new Convert().toHtml(
              PlaygroundService.discoverErrorResponse(response).join('\n'));
          }

          compileResponse.makeSafe(this.domSanitizer);

          // Return response
          return compileResponse;
        }),
        catchError(error => {
          console.error(error);
          compileResponse.error = 'Problem connecting to Compiler Explorer API, please try again later.'
          return of(compileResponse)
        })
      );
  }

  /**
   * Return an empty compilation result.
   */
  static getEmptyResult(): CompilationResultModel {
    return new CompilationResultModel();
  }

  /**
   * Return the most helpful error result we can.
   * @param response
   */
  static discoverErrorResponse(
    response: any
  ): [] {
    let errorLines = [];

    if (response['execResult']
      && response['execResult']['stderr']) {
      errorLines = response['execResult']['stderr'];
    }

    if (response['stderr']) {
      errorLines = errorLines.concat(response['stderr']);
    }

    response['asm'] = [];
    console.error(response)

    return errorLines.map((line: any) => {
      return line['text'].replaceAll('<', '&lt;').replaceAll('>', '&gt;');
    });
  }

  /**
   * Wrap a request for sending to compiler explorer backend.
   * @param code
   */
  static wrapRequest(
    code: string
  ): {} {
    return {
      'source': code,
      'compiler': 'icx202400',
      'options': {
        'userArguments': '-fsycl -g0 -Rno-debug-disables-optimization',
        'compilerOptions': {
          'producePp': null,
          'produceGccDump': {},
          'produceOptInfo': false,
          'produceCfg': false,
          'produceIr': null,
          'produceOptPipeline': null,
          'produceDevice': false,
          'overrides': []
        },
        'filters': {
          'binaryObject': false,
          'binary': false,
          'execute': true,
          'intel': true,
          'demangle': true,
          'labels': true,
          'libraryCode': true,
          'directives': true,
          'commentOnly': true,
          'trim': false,
          'debugCalls': false
        },
        'tools': [],
        'libraries': [],
        'executeParameters': {'args': '', 'stdin': ''}
      },
      'lang': 'c++',
      'files': [],
      'bypassCache': 0,
      'allowStoreCodeDebug': true
    }
  }
}

