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

import { ChangeDetectionStrategy, Component, Inject, signal, Signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { PopupReference } from '../../../../shared/components/popup/PopupService';
import { PlaygroundSampleModel } from '../../../../shared/models/playground-sample.model';
import { PlaygroundSampleService } from '../../../../shared/services/models/playground-sample.service';
import { LoadingState } from '../../../../shared/LoadingState';
import { tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'st-sample-chooser',
  standalone: true,
  imports: [
    CommonModule,
    LoadingComponent,
  ],
  templateUrl: './sample-chooser.component.html',
  styleUrl: './sample-chooser.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SampleChooserComponent {
  protected readonly samples: Signal<PlaygroundSampleModel[]>;
  protected readonly state: WritableSignal<LoadingState>;
  protected readonly LoadingState = LoadingState;

  /**
   * Constructor.
   * @param popupReference
   * @param playgroundSampleService
   */
  constructor(
    @Inject('POPUP_DATA') protected popupReference: PopupReference,
    protected playgroundSampleService: PlaygroundSampleService
  ) {
    this.state = signal(LoadingState.NOT_STARTED);
    this.samples = toSignal(this.getSamples(), { initialValue: [] });
  }

  /**
   * Get samples from the backend.
   */
  getSamples() {
    this.state.set(LoadingState.LOADING);

    return this.playgroundSampleService.getSamples().pipe(
      tap(() => {
        this.state.set(LoadingState.LOAD_SUCCESS);
      })
    );
  }

  /**
   * Called when a user chooses a specific sample.
   * @param sample
   */
  onChooseSample(sample: PlaygroundSampleModel) {
    this.popupReference.close(sample);
  }

  /**
   * Called when a user chooses to start fresh.
   */
  onChooseNew() {
    this.popupReference.close({
      title: 'Custom',
      name: 'New',
      code: "#include <sycl/sycl.hpp>\n" +
        "\n" +
        "class my_code;\n" +
        "\n" +
        "int main(int, char**) {\n" +
        "  return 0;\n" +
        "}\n"
    });
  }

  protected readonly environment = environment;
}
