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

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Represents a compilation result gathered from a compiler explorer response.
 */
export class CompilationResultModel {
  public assembly: string = '';
  public result: any = '';
  public error: any = '';
  public platform: any = null;

  public safeAssembly: SafeHtml = '';
  public safeResult: SafeHtml = '';
  public safeError: SafeHtml = '';

  /**
   * Generate the "safe" values.
   * @param domSanitizer
   */
  makeSafe(domSanitizer: DomSanitizer) {
    this.safeAssembly = domSanitizer.bypassSecurityTrustHtml(this.assembly);
    this.safeResult = domSanitizer.bypassSecurityTrustHtml(this.result);
    this.safeError = domSanitizer.bypassSecurityTrustHtml(this.error);
  }

  /**
   * If this represents an error result.
   */
  isError(): boolean {
    return this.error.length > 1;
  }

  /**
   * If this has a result or not.
   */
  hasResult(): boolean {
    return this.result.length > 1;
  }

  /**
   * If this has assembly or not.
   */
  hasAssembly(): boolean {
    return this.assembly.length > 1;
  }
}
