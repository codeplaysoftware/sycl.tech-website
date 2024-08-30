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
import { CompilationResultModel } from '../../models/compilation-result.model';
import { PlaygroundSampleModel } from '../../models/playground-sample.model';
import Convert from 'ansi-to-html';

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
    console.error(response);

    return errorLines.map((line: any) => {
      return line['text'].replaceAll('<', '&lt;').replaceAll('>', '&gt;');
    });
  }

  /**
   * Create a sharable code sample URL.
   * @param code
   */
  createCodeSampleUrl(code: string) {
    const requestBody = {
      "config": {
        "settings": {
          "hasHeaders": true,
          "constrainDragToContainer": false,
          "reorderEnabled": true,
          "selectionEnabled": false,
          "popoutWholeStack": false,
          "blockedPopoutsThrowError": true,
          "closePopoutsOnUnload": true,
          "showPopoutIcon": false,
          "showMaximiseIcon": true,
          "showCloseIcon": true,
          "responsiveMode": "onload",
          "tabOverlapAllowance": 0,
          "reorderOnTabMenuClick": true,
          "tabControlOffset": 10
        },
        "dimensions": {
          "borderWidth": 5,
          "borderGrabWidth": 15,
          "minItemHeight": 10,
          "minItemWidth": 10,
          "headerHeight": 20,
          "dragProxyWidth": 300,
          "dragProxyHeight": 200
        },
        "labels": {
          "close": "close",
          "maximise": "maximise",
          "minimise": "minimise",
          "popout": "open in new window",
          "popin": "pop in",
          "tabDropdown": "additional tabs"
        },
        "content": [
          {
            "type": "row",
            "isClosable": true,
            "reorderEnabled": true,
            "title": "",
            "content": [
              {
                "type": "stack",
                "width": 50,
                "isClosable": true,
                "reorderEnabled": true,
                "title": "",
                "activeItemIndex": 0,
                "content": [
                  {
                    "type": "component",
                    "componentName": "codeEditor",
                    "componentState": {
                      "id": 1,
                      "source": code,
                      "lang": "c++",
                      "selection": {
                        "startLineNumber": 2,
                        "startColumn": 22,
                        "endLineNumber": 2,
                        "endColumn": 22,
                        "selectionStartLineNumber": 2,
                        "selectionStartColumn": 22,
                        "positionLineNumber": 2,
                        "positionColumn": 22
                      },
                      "filename": false,
                      "fontScale": 14,
                      "fontUsePx": true
                    },
                    "isClosable": false,
                    "reorderEnabled": true,
                    "title": "C++ source #1"
                  }
                ]
              },
              {
                "type": "stack",
                "width": 50,
                "isClosable": true,
                "reorderEnabled": true,
                "title": "",
                "activeItemIndex": 0,
                "content": [
                  {
                    "type": "component",
                    "componentName": "compiler",
                    "componentState": {
                      "id": 1,
                      "compiler": "icx202420",
                      "source": 1,
                      "options": "-fsycl -g0",
                      "filters": {
                        "binaryObject": false,
                        "binary": false,
                        "execute": false,
                        "intel": true,
                        "demangle": true,
                        "verboseDemangling": true,
                        "labels": true,
                        "libraryCode": true,
                        "directives": true,
                        "commentOnly": true,
                        "trim": false,
                        "debugCalls": false
                      },
                      "libs": [],
                      "lang": "c++",
                      "selection": {
                        "startLineNumber": 1,
                        "startColumn": 1,
                        "endLineNumber": 1,
                        "endColumn": 1,
                        "selectionStartLineNumber": 1,
                        "selectionStartColumn": 1,
                        "positionLineNumber": 1,
                        "positionColumn": 1
                      },
                      "flagsViewOpen": false,
                      "overrides": [],
                      "fontScale": 14,
                      "fontUsePx": true
                    },
                    "isClosable": true,
                    "reorderEnabled": true,
                    "title": "x86-64 icx 2024.2.0 (Editor #1)"
                  }
                ]
              }
            ]
          }
        ],
        "isClosable": true,
        "reorderEnabled": true,
        "title": "",
        "openPopouts": [],
        "maximisedItemId": null
      }
    };
    const options = {
      headers: {
        'Content-Type': 'application/json',
      }
    }

    return this.httpClient.post<any>(
      'https://godbolt.org/api/shortener',JSON.stringify(requestBody), options)
      .pipe(
        map(response => response['url'])
      );
  }

  /**
   * Load an existing code sample from the compiler explorer API.
   * @param sampleId
   */
  loadCodeSample(sampleId: string) {
    return this.httpClient.get<any>(`https://godbolt.org/api/shortlinkinfo/${sampleId}`)
      .pipe(
        map((response) => {
          return response['sessions'][0]['source'];
        })
      );
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

