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
import { ChangeDetectionStrategy, Component, input, model, OnInit, Signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HighlightJS } from 'ngx-highlightjs';
import { from, map, Observable, switchMap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'st-syntax-code-block',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './syntax-code-block.component.html',
  styleUrls: [
    './syntax-code-block.component.scss',
    './syntax-highlighting-rules.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SyntaxCodeBlockComponent implements OnInit {
  code = model<string>('');
  editable = input<boolean>(true);
  highlight = input<boolean>(true);
  caretColor = input<string>('white');

  protected readonly highlighted: Signal<string | undefined>;
  protected originalPlainTextCode: string = '';

  /**
   * Constructor.
   * @param highlightJSService
   * @param domSanitizer
   */
  constructor(
    protected highlightJSService: HighlightJS,
    protected domSanitizer: DomSanitizer
  ) {
    this.highlighted = toSignal(
      toObservable(this.code).pipe(
        switchMap(plainCode => this.highlightCode(plainCode))));
  }

  /**
   * @inheritDoc
   */
  ngOnInit() {
    this.originalPlainTextCode = this.code();
  }

  /**
   * Highlight the plain text code using highlighting engine.
   * @param code
   */
  highlightCode(code: string): Observable<string> {
    const language = this.highlight() ? 'cpp' : 'text';
    return from(this.highlightJSService.highlight(code, { language })).pipe(
      map(plainCode => plainCode.value));
  }

  /**
   * Get escaped code that can be rendered inside a contentEditable div.
   * @param code
   */
  getEscapedCode(code: string) {
    return code
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
  }

  /**
   * We need to ensure enter is treated the same as shift+enter.
   * @param $event
   */
  onKeyDown($event: any) {
    if ($event.key == 'Enter') {
      $event.preventDefault();

      const sel = window.getSelection();
      if (sel) {
        const range = sel.getRangeAt(0);
        range.deleteContents();

        const textNode = document.createTextNode('\n');
        range.insertNode(textNode);

        range.setStart(textNode, textNode.length);
        range.setEnd(textNode, textNode.length);

        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }

  /**
   * Called when the code changes.
   * @param $event
   */
  onChange($event: any) {
    this.code.set($event.target.innerText);
  }
}
