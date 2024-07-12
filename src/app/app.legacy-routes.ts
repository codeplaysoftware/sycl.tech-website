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

import { Routes } from '@angular/router';

export const appLegacyRoutes: Routes = [
  {
    path: 'learn',
    redirectTo: 'getting-started'
  },
  {
    path: 'releases',
    redirectTo: 'ecosystem/implementations'
  },
  {
    path: 'projects',
    redirectTo: 'ecosystem/projects'
  },
  {
    path: 'research',
    redirectTo: 'ecosystem/research'
  },
  {
    path: 'videos',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'news/16/05/26/khronos-updates-opencl-and-sycl-specifications',
    redirectTo: 'news/2016/05/26/khronos-updates-opencl-and-sycl-specifications'
  },
  {
    path: 'news/16/05/26/khronos-releases-wave-of-new-standards',
    redirectTo: 'news/2016/05/26/khronos-releases-wave-of-new-standards'
  },
  {
    path: 'news/16/05/26/computec-delivering-sycl-based-technologies',
    redirectTo: 'news/2016/05/26/computec-delivering-sycl-based-technologies'
  },
  {
    path: 'news/16/05/26/khronos-works-on-sycl-for-pushing-opencl-in-c',
    redirectTo: 'news/2016/05/26/khronos-works-on-sycl-for-pushing-opencl-in-c'
  },
  {
    path: 'news/16/06/15/khronos-releases-sycl-1-2-final-specification',
    redirectTo: 'news/2016/06/15/khronos-releases-sycl-1-2-final-specification'
  },
  {
    path: 'news/16/08/25/khronos-releases-sycl-2-2-provisional-specification',
    redirectTo: 'news/2016/08/25/khronos-releases-sycl-2-2-provisional-specification'
  },
  {
    path: 'news/16/09/19/visionc-hello-world-example-released',
    redirectTo: 'news/2016/09/19/visionc-hello-world-example-released'
  },
  {
    path: 'news/16/09/19/early-access-to-the-sycl-open-standard-for-c-acceleration',
    redirectTo: 'news/2016/09/19/early-access-to-the-sycl-open-standard-for-c-acceleration'
  },
  {
    path: 'news/17/01/18/bridging-the-gap-on-risc-v-with-the-open-standards-opencl-and-sycl',
    redirectTo: 'news/2017/01/18/bridging-the-gap-on-risc-v-with-the-open-standards-opencl-and-sycl'
  },
  {
    path: 'news/17/01/19/new-version-of-codeplay-sycl-implementation-available',
    redirectTo: 'news/2017/01/19/new-version-of-codeplay-sycl-implementation-available'
  },
  {
    path: 'news/17/01/27/setting-up-tensorflow-with-opencl-using-sycl',
    redirectTo: 'news/2017/01/27/setting-up-tensorflow-with-opencl-using-sycl'
  },
  {
    path: 'news/17/02/20/bringing-the-acceleration-of-opencl-to-tensorflow-with-sycl',
    redirectTo: 'news/2017/02/20/bringing-the-acceleration-of-opencl-to-tensorflow-with-sycl'
  },
  {
    path: 'news/17/03/06/anisotropic-diffusion-using-visionc-and-sycl',
    redirectTo: 'news/2017/03/06/anisotropic-diffusion-using-visionc-and-sycl'
  },
  {
    path: 'news/17/03/14/get-started-with-eigen-and-sycl',
    redirectTo: 'news/2017/03/14/get-started-with-eigen-and-sycl'
  },
  {
    path: 'news/17/03/14/distributed-heterogeneous-programming-in-c-c',
    redirectTo: 'news/2017/03/14/distributed-heterogeneous-programming-in-c-c'
  },
  {
    path: 'news/17/05/16/computec-support-for-ubuntu-16-04-at-iwocl',
    redirectTo: 'news/2017/05/16/computec-support-for-ubuntu-16-04-at-iwocl'
  },
  {
    path: 'news/17/05/22/accelerating-your-c-on-gpu-with-sycl',
    redirectTo: 'news/2017/05/22/accelerating-your-c-on-gpu-with-sycl'
  },
  {
    path: 'news/17/05/23/implementing-opencl-support-for-eigen-using-sycl',
    redirectTo: 'news/2017/05/23/implementing-opencl-support-for-eigen-using-sycl'
  },
  {
    path: 'news/17/08/18/using-sycl-to-enable-tensorflow-1-3-on-ubuntu-16-04-lts',
    redirectTo: 'news/2017/08/18/using-sycl-to-enable-tensorflow-1-3-on-ubuntu-16-04-lts'
  },
  {
    path: 'news/17/08/23/use-sycl-to-target-spir-v-devices',
    redirectTo: 'news/2017/08/23/use-sycl-to-target-spir-v-devices'
  },
  {
    path: 'news/17/09/22/sycl-solution-for-imp-x5-renesas-hardware',
    redirectTo: 'news/2017/09/22/sycl-solution-for-imp-x5-renesas-hardware'
  },
  {
    path: 'news/17/09/22/renesas-and-codeplay-collaborate-on-sycl-for-adas-solutions',
    redirectTo: 'news/2017/09/22/renesas-and-codeplay-collaborate-on-sycl-for-adas-solutions'
  },
  {
    path: 'news/17/10/03/windows-support-for-sycl-with-computec',
    redirectTo: 'news/2017/10/03/windows-support-for-sycl-with-computec'
  },
  {
    path: 'news/17/11/20/managed-virtual-pointers-with-sycl',
    redirectTo: 'news/2017/11/20/managed-virtual-pointers-with-sycl'
  },
  {
    path: 'news/18/01/03/renesas-accelerates-ncap-front-camera-application-development-with-sycl',
    redirectTo: 'news/2018/01/03/renesas-accelerates-ncap-front-camera-application-development-with-sycl'
  },
  {
    path: 'news/18/01/03/alternative-machine-learning-algorithms-using-sycl-and-opencl',
    redirectTo: 'news/2018/01/03/alternative-machine-learning-algorithms-using-sycl-and-opencl'
  },
  {
    path: 'news/18/01/04/computec-v0-5-0-is-released-and-sycl-1-2-1-ratified',
    redirectTo: 'news/2018/01/04/computec-v0-5-0-is-released-and-sycl-1-2-1-ratified'
  },
  {
    path: 'news/18/01/30/using-template-sorcery-to-implement-sycl-interoperability',
    redirectTo: 'news/2018/01/30/using-template-sorcery-to-implement-sycl-interoperability'
  },
  {
    path: 'news/18/03/14/buffer-reinterpret-viewing-data-from-a-different-perspective',
    redirectTo: 'news/2018/03/14/buffer-reinterpret-viewing-data-from-a-different-perspective'
  },
  {
    path: 'news/18/03/15/open-standards-sycl-and-opencl-in-a-new-automotive-era',
    redirectTo: 'news/2018/03/15/open-standards-sycl-and-opencl-in-a-new-automotive-era'
  },
  {
    path: 'news/18/04/24/sycl-profiling-developed-by-lpgpu2-project',
    redirectTo: 'news/2018/04/24/sycl-profiling-developed-by-lpgpu2-project'
  },
  {
    path: 'news/18/05/15/computec-v0-8-0-is-here',
    redirectTo: 'news/2018/05/15/computec-v0-8-0-is-here'
  },
  {
    path: 'news/18/07/12/khronos-releases-conformance-test-suite-for-sycl-1-2-1',
    redirectTo: 'news/2018/07/12/khronos-releases-conformance-test-suite-for-sycl-1-2-1'
  },
  {
    path: 'news/18/07/23/solving-maxwell-s-equations-with-modern-c-and-sycl-a-case-study',
    redirectTo: 'news/2018/07/23/solving-maxwell-s-equations-with-modern-c-and-sycl-a-case-study'
  },
  {
    path: 'news/18/07/23/new-computer-architectures-and-next-generation-numerical-weather-forecasting',
    redirectTo: 'news/2018/07/23/new-computer-architectures-and-next-generation-numerical-weather-forecasting'
  },
  {
    path: 'news/18/07/26/computec-ce-0-9-1-release',
    redirectTo: 'news/2018/07/26/computec-ce-0-9-1-release'
  },
  {
    path: 'news/18/08/02/solving-maxwell-s-equations-on-unstructured-meshes-with-sycl',
    redirectTo: 'news/2018/08/02/solving-maxwell-s-equations-on-unstructured-meshes-with-sycl'
  },
  {
    path: 'news/18/08/23/codeplay-announces-world-s-first-fully-conformant-sycl-1-2-1-solution',
    redirectTo: 'news/2018/08/23/codeplay-announces-world-s-first-fully-conformant-sycl-1-2-1-solution'
  },
  {
    path: 'news/18/08/23/codeplay-releases-first-fully-conformant-sycl-1-2-1-solution-for-c',
    redirectTo: 'news/2018/08/23/codeplay-releases-first-fully-conformant-sycl-1-2-1-solution-for-c'
  },
  {
    path: 'news/18/08/23/codeplay-ver-ffentlicht-mit-computec-1-0-ein-sycl-konformes-werkzeug',
    redirectTo: 'news/2018/08/23/codeplay-ver-ffentlicht-mit-computec-1-0-ein-sycl-konformes-werkzeug'
  },
  {
    path: 'news/18/08/23/computec-from-0-1-to-1-0-and-sycl-conformance-in-2-years',
    redirectTo: 'news/2018/08/23/computec-from-0-1-to-1-0-and-sycl-conformance-in-2-years'
  },
  {
    path: 'news/18/10/01/khronos-standards-for-machine-learning',
    redirectTo: 'news/2018/10/01/khronos-standards-for-machine-learning'
  },
  {
    path: 'news/18/11/19/red-hat-developers-working-towards-a-vendor-neutral-compute-stack-to-take-on-nvidia-s-cuda',
    redirectTo: 'news/2018/11/19/red-hat-developers-working-towards-a-vendor-neutral-compute-stack-to-take-on-nvidia-s-cuda'
  },
  {
    path: 'news/18/12/06/imagination-unveils-sycl-support-in-new-powervr-accelerator',
    redirectTo: 'news/2018/12/06/imagination-unveils-sycl-support-in-new-powervr-accelerator'
  },
  {
    path: 'news/18/12/10/david-airlie-s-lpc2018-presentation-on-an-open-source-cuda',
    redirectTo: 'news/2018/12/10/david-airlie-s-lpc2018-presentation-on-an-open-source-cuda'
  },
  {
    path: 'news/19/01/10/sycl-implementations-in-2019',
    redirectTo: 'news/2019/01/10/sycl-implementations-in-2019'
  },
  {
    path: 'news/19/01/14/intel-looking-to-add-sycl-programming-support-to-llvm-clang',
    redirectTo: 'news/2019/01/14/intel-looking-to-add-sycl-programming-support-to-llvm-clang'
  },
  {
    path: 'news/19/01/29/embedded-ai-with-powervr-series3nx-and-sycl',
    redirectTo: 'news/2019/01/29/embedded-ai-with-powervr-series3nx-and-sycl'
  },
  {
    path: 'news/19/03/11/khronos-opencl-sycl-and-spir-v-standards-find-growing-synergy-with-llvm-s-compiler-community',
    redirectTo: 'news/2019/03/11/khronos-opencl-sycl-and-spir-v-standards-find-growing-synergy-with-llvm-s-compiler-community'
  },
  {
    path: 'news/19/03/11/khronos-continues-working-on-better-opencl-llvm-integration-with-sycl',
    redirectTo: 'news/2019/03/11/khronos-continues-working-on-better-opencl-llvm-integration-with-sycl'
  },
  {
    path: 'news/19/04/03/codeplay-software-releases-computec-professional-edition',
    redirectTo: 'news/2019/04/03/codeplay-software-releases-computec-professional-edition'
  },
  {
    path: 'news/19/04/17/intel-sycl-compiler-zero-cost-abstraction-and-type-safety-for-heterogeneous-computing',
    redirectTo: 'news/2019/04/17/intel-sycl-compiler-zero-cost-abstraction-and-type-safety-for-heterogeneous-computing'
  },
  {
    path: 'news/19/04/30/intel-continues-working-on-their-sycl-compiler-for-upstreaming-to-llvm',
    redirectTo: 'news/2019/04/30/intel-continues-working-on-their-sycl-compiler-for-upstreaming-to-llvm'
  },
  {
    path: 'news/19/05/20/hipsycl-gets-new-compilation-toolchain-for-taking-sycl-directly-to-cuda-rocm',
    redirectTo: 'news/2019/05/20/hipsycl-gets-new-compilation-toolchain-for-taking-sycl-directly-to-cuda-rocm'
  },
  {
    path: 'news/19/06/12/generic-interfaces-with-generic-lambdas-with-c-and-sycl',
    redirectTo: 'news/2019/06/12/generic-interfaces-with-generic-lambdas-with-c-and-sycl'
  },
  {
    path: 'news/19/06/17/sycl-code-generation-for-multigrid-methods',
    redirectTo: 'news/2019/06/17/sycl-code-generation-for-multigrid-methods'
  },
  {
    path: 'news/19/06/20/intel-s-one-api-project-delivers-unified-programming-model-across-diverse-architectures',
    redirectTo: 'news/2019/06/20/intel-s-one-api-project-delivers-unified-programming-model-across-diverse-architectures'
  },
  {
    path: 'news/19/06/27/intel-launches-new-c-based-language-as-part-of-one-api-plans',
    redirectTo: 'news/2019/06/27/intel-launches-new-c-based-language-as-part-of-one-api-plans'
  },
  {
    path: 'news/19/07/01/comparing-sycl-and-cuda',
    redirectTo: 'news/2019/07/01/comparing-sycl-and-cuda'
  },
  {
    path: 'news/19/07/01/resyclator-transforming-cuda-c-source-code-into-sycl',
    redirectTo: 'news/2019/07/01/resyclator-transforming-cuda-c-source-code-into-sycl'
  },
  {
    path: 'news/19/07/12/enabling-polymorphism-in-sycl-using-the-c-idiom-crtp',
    redirectTo: 'news/2019/07/12/enabling-polymorphism-in-sycl-using-the-c-idiom-crtp'
  },
  {
    path: 'news/19/07/30/intel-s-llvm-based-sycl-compiler-continues-taking-shape',
    redirectTo: 'news/2019/07/30/intel-s-llvm-based-sycl-compiler-continues-taking-shape'
  },
  {
    path: 'news/19/08/26/intel-sycl-compiler-runtimes-updated-with-unified-shared-memory-support',
    redirectTo: 'news/2019/08/26/intel-sycl-compiler-runtimes-updated-with-unified-shared-memory-support'
  },
  {
    path: 'news/19/09/01/optimizing-your-sycl-code-using-profiling',
    redirectTo: 'news/2019/09/01/optimizing-your-sycl-code-using-profiling'
  },
  {
    path: 'news/19/09/20/ai-accelerators-and-open-software',
    redirectTo: 'news/2019/09/20/ai-accelerators-and-open-software'
  },
  {
    path: 'news/19/09/22/why-unified-programming-future-app-dev',
    redirectTo: 'news/2019/09/22/why-unified-programming-future-app-dev'
  },
  {
    path: 'news/19/09/23/accelerating-ai-performance-open-ecosystem',
    redirectTo: 'news/2019/09/23/accelerating-ai-performance-open-ecosystem'
  },
  {
    path: 'news/19/09/26/intel-sycl-compiler',
    redirectTo: 'news/2019/09/26/intel-sycl-compiler'
  },
  {
    path: 'news/19/10/08/windriver-vxworks',
    redirectTo: 'news/2019/10/08/windriver-vxworks'
  },
  {
    path: 'news/19/10/17/sycl-academy',
    redirectTo: 'news/2019/10/17/sycl-academy'
  },
  {
    path: 'news/19/10/24/tf-imagination',
    redirectTo: 'news/2019/10/24/tf-imagination'
  },
  {
    path: 'news/19/10/29/debugging-sycl-applications',
    redirectTo: 'news/2019/10/29/debugging-sycl-applications'
  },
  {
    path: 'news/19/11/08/supercomputing19',
    redirectTo: 'news/2019/11/08/supercomputing19'
  },
  {
    path: 'news/19/11/15/sycl-book',
    redirectTo: 'news/2019/11/15/sycl-book'
  },
  {
    path: 'news/19/11/17/one-api',
    redirectTo: 'news/2019/11/17/one-api'
  },
  {
    path: 'news/19/11/17/one-api-phoronix',
    redirectTo: 'news/2019/11/17/one-api-phoronix'
  },
  {
    path: 'news/19/11/19/acoran-announced',
    redirectTo: 'news/2019/11/19/acoran-announced'
  },
  {
    path: 'news/19/12/16/sycl-on-nvidia',
    redirectTo: 'news/2019/12/16/sycl-on-nvidia'
  },
  {
    path: 'news/20/01/06/cloverleaf-sycl',
    redirectTo: 'news/2020/01/06/cloverleaf-sycl'
  },
  {
    path: 'news/20/01/16/work-group-size',
    redirectTo: 'news/2020/01/16/work-group-size'
  },
  {
    path: 'news/20/01/22/dpc-ahead-of-time',
    redirectTo: 'news/2020/01/22/dpc-ahead-of-time'
  },
  {
    path: 'news/20/02/03/sycl-cuda',
    redirectTo: 'news/2020/02/03/sycl-cuda'
  },
  {
    path: 'news/20/04/20/sycl-sc2019',
    redirectTo: 'news/2020/04/20/sycl-sc2019'
  },
  {
    path: 'news/20/04/20/codeplay-iwocl',
    redirectTo: 'news/2020/04/20/codeplay-iwocl'
  },
  {
    path: 'news/20/04/22/sycl-onemkl',
    redirectTo: 'news/2020/04/22/sycl-onemkl'
  },
  {
    path: 'news/20/04/27/computec-2-0',
    redirectTo: 'news/2020/04/27/computec-2-0'
  },
  {
    path: 'news/20/04/29/sycl-iwocl20',
    redirectTo: 'news/2020/04/29/sycl-iwocl20'
  },
  {
    path: 'news/20/05/02/uob-blog',
    redirectTo: 'news/2020/05/02/uob-blog'
  },
  {
    path: 'news/20/05/15/codeproject',
    redirectTo: 'news/2020/05/15/codeproject'
  },
  {
    path: 'news/20/05/15/phoronix-cuda-dpc',
    redirectTo: 'news/2020/05/15/phoronix-cuda-dpc'
  },
  {
    path: 'news/20/05/15/podcast',
    redirectTo: 'news/2020/05/15/podcast'
  },
  {
    path: 'news/20/05/20/ray-trace-pt-1',
    redirectTo: 'news/2020/05/20/ray-trace-pt-1'
  },
  {
    path: 'news/20/05/22/exascale',
    redirectTo: 'news/2020/05/22/exascale'
  },
  {
    path: 'news/20/05/28/podcast-mkl',
    redirectTo: 'news/2020/05/28/podcast-mkl'
  },
  {
    path: 'news/20/06/05/dpc-release',
    redirectTo: 'news/2020/06/05/dpc-release'
  },
  {
    path: 'news/20/06/09/isoc-sycl',
    redirectTo: 'news/2020/06/09/isoc-sycl'
  },
  {
    path: 'news/20/06/09/ccast-michael',
    redirectTo: 'news/2020/06/09/ccast-michael'
  },
  {
    path: 'news/20/06/26/intel-oneapi-dpc-compiler-2020-06-released-with-new-features',
    redirectTo: 'news/2020/06/26/intel-oneapi-dpc-compiler-2020-06-released-with-new-features'
  },
  {
    path: 'news/20/06/29/open-standards-automotive',
    redirectTo: 'news/2020/06/29/open-standards-automotive'
  },
  {
    path: 'news/20/07/01/podcast-ronan-jeff',
    redirectTo: 'news/2020/07/01/podcast-ronan-jeff'
  },
  {
    path: 'news/20/07/01/sycl2020-released-khronos',
    redirectTo: 'news/2020/07/01/sycl2020-released-khronos'
  },
  {
    path: 'news/20/07/13/hpc-sycl',
    redirectTo: 'news/2020/07/13/hpc-sycl'
  },
  {
    path: 'news/20/07/28/safety-blog-1',
    redirectTo: 'news/2020/07/28/safety-blog-1'
  },
  {
    path: 'news/20/08/14/power-hpc',
    redirectTo: 'news/2020/08/14/power-hpc'
  },
  {
    path: 'news/20/08/14/codeplay-sycl2020',
    redirectTo: 'news/2020/08/14/codeplay-sycl2020'
  },
  {
    path: 'news/20/08/25/brightskies-dpc',
    redirectTo: 'news/2020/08/25/brightskies-dpc'
  },
  {
    path: 'news/20/09/11/celerity',
    redirectTo: 'news/2020/09/11/celerity'
  },
  {
    path: 'news/20/10/01/oneapi-academic-center-of-excellence-opened-at-heidelberg-university',
    redirectTo: 'news/2020/10/01/oneapi-academic-center-of-excellence-opened-at-heidelberg-university'
  },
  {
    path: 'news/20/11/05/in-pursuit-of-the-holy-grail-portable-performant-programming',
    redirectTo: 'news/2020/11/05/in-pursuit-of-the-holy-grail-portable-performant-programming'
  },
  {
    path: 'news/20/11/05/read-the-sycl-book-for-free',
    redirectTo: 'news/2020/11/05/read-the-sycl-book-for-free'
  },
  {
    path: 'news/20/11/10/join-the-sycl-bof-at-sc20-with-bjarne-stroustrup',
    redirectTo: 'news/2020/11/10/join-the-sycl-bof-at-sc20-with-bjarne-stroustrup'
  },
  {
    path: 'news/20/11/11/develop-with-sycl-on-a-raspberrypi',
    redirectTo: 'news/2020/11/11/develop-with-sycl-on-a-raspberrypi'
  },
  {
    path: 'news/20/11/16/use-oneapi-to-make-your-c-application-gpu-aware',
    redirectTo: 'news/2020/11/16/use-oneapi-to-make-your-c-application-gpu-aware'
  },
  {
    path: 'news/20/11/16/a-sobel-convolution-using-sycl',
    redirectTo: 'news/2020/11/16/a-sobel-convolution-using-sycl'
  },
  {
    path: 'news/20/11/16/intel-debuts-oneapi-gold-and-provides-more-details-on-gpu-roadmap',
    redirectTo: 'news/2020/11/16/intel-debuts-oneapi-gold-and-provides-more-details-on-gpu-roadmap'
  },
  {
    path: 'news/20/11/24/migrating-cuda-stencil-code-to-sycl-video',
    redirectTo: 'news/2020/11/24/migrating-cuda-stencil-code-to-sycl-video'
  },
  {
    path: 'news/20/12/03/a-step-by-step-tutorial-for-developing-sycl-with-dpc',
    redirectTo: 'news/2020/12/03/a-step-by-step-tutorial-for-developing-sycl-with-dpc'
  },
  {
    path: 'news/20/12/14/new-sycl-ray-tracer-project',
    redirectTo: 'news/2020/12/14/new-sycl-ray-tracer-project'
  },
  {
    path: 'news/20/12/14/a-guode-to-migrating-opencl-code-to-sycl',
    redirectTo: 'news/2020/12/14/a-guode-to-migrating-opencl-code-to-sycl'
  },
  {
    path: 'news/20/12/15/a-vendor-neutral-path-to-math-acceleration',
    redirectTo: 'news/2020/12/15/a-vendor-neutral-path-to-math-acceleration'
  },
  {
    path: 'news/20/12/15/the-great-cross-architecture-challenge',
    redirectTo: 'news/2020/12/15/the-great-cross-architecture-challenge'
  },
  {
    path: 'news/21/01/13/preparing-an-earthquake-risk-assessment-application-for-exascale',
    redirectTo: 'news/2021/01/13/preparing-an-earthquake-risk-assessment-application-for-exascale'
  },
  {
    path: 'news/21/01/20/raytracing-from-cuda-to-sycl-2020',
    redirectTo: 'news/2021/01/20/raytracing-from-cuda-to-sycl-2020'
  },
  {
    path: 'news/21/01/20/solving-a-2d-heat-equation-using-sycl-and-dpc',
    redirectTo: 'news/2021/01/20/solving-a-2d-heat-equation-using-sycl-and-dpc'
  },
  {
    path: 'news/21/02/01/podcast-expanding-the-sycl-2020-ecosystem',
    redirectTo: 'news/2021/02/01/podcast-expanding-the-sycl-2020-ecosystem'
  },
  {
    path: 'news/21/02/03/nersc-alcf-codeplay-partner-on-sycl-for-next-generation-supercomputers',
    redirectTo: 'news/2021/02/03/nersc-alcf-codeplay-partner-on-sycl-for-next-generation-supercomputers'
  },
  {
    path: 'news/21/02/10/sycl-2020-update-includes-dozens-of-new-features-and-closer-alignment-with-iso-c',
    redirectTo: 'news/2021/02/10/sycl-2020-update-includes-dozens-of-new-features-and-closer-alignment-with-iso-c'
  },
  {
    path: 'news/21/02/16/pdocast-exascale-earthquake-simulator-with-sycl',
    redirectTo: 'news/2021/02/16/pdocast-exascale-earthquake-simulator-with-sycl'
  },
  {
    path: 'news/21/02/16/using-the-new-features-of-sycl-2020-in-babelstream',
    redirectTo: 'news/2021/02/16/using-the-new-features-of-sycl-2020-in-babelstream'
  },
  {
    path: 'news/21/02/24/hipsycl-0-9-0-sycl-2020-features-coming-to-hipsycl',
    redirectTo: 'news/2021/02/24/hipsycl-0-9-0-sycl-2020-features-coming-to-hipsycl'
  },
  {
    path: 'news/21/04/15/taskflow-v3-1-a-new-tasking-model-to-program-sycl',
    redirectTo: 'news/2021/04/15/taskflow-v3-1-a-new-tasking-model-to-program-sycl'
  },
  {
    path: 'news/21/04/15/podcast-acceleration-at-the-edge',
    redirectTo: 'news/2021/04/15/podcast-acceleration-at-the-edge'
  },
  {
    path: 'news/21/04/15/xpu-blog-hello-sycl-and-dpc',
    redirectTo: 'news/2021/04/15/xpu-blog-hello-sycl-and-dpc'
  },
  {
    path: 'news/21/04/27/heterogeneous-processing-requires-data-parallelization-sycl-and-dpc-are-a-good-start',
    redirectTo: 'news/2021/04/27/heterogeneous-processing-requires-data-parallelization-sycl-and-dpc-are-a-good-start'
  },
  {
    path: 'news/21/04/27/what-to-see-online-at-iwocl-syclcon-2021',
    redirectTo: 'news/2021/04/27/what-to-see-online-at-iwocl-syclcon-2021'
  },
  {
    path: 'news/21/05/03/iwocl-syclcon-2021-slides-videos-published-for-lots-of-opencl-sycl-technical-talks',
    redirectTo: 'news/2021/05/03/iwocl-syclcon-2021-slides-videos-published-for-lots-of-opencl-sycl-technical-talks'
  },
  {
    path: 'news/21/05/04/porting-a-lattice-qcd-code-suite-to-exascale-architectures',
    redirectTo: 'news/2021/05/04/porting-a-lattice-qcd-code-suite-to-exascale-architectures'
  },
  {
    path: 'news/21/05/13/sylkan-towards-a-vulkan-compute-target-platform-for-sycl',
    redirectTo: 'news/2021/05/13/sylkan-towards-a-vulkan-compute-target-platform-for-sycl'
  },
  {
    path: 'news/21/05/18/porting-a-particle-in-cell-code-to-exascale-architectures',
    redirectTo: 'news/2021/05/18/porting-a-particle-in-cell-code-to-exascale-architectures'
  },
  {
    path: 'news/21/06/21/argonne-ornl-award-codeplay-contract-to-strengthen-sycl-support-for-amd-gpus',
    redirectTo: 'news/2021/06/21/argonne-ornl-award-codeplay-contract-to-strengthen-sycl-support-for-amd-gpus'
  },
  {
    path: 'news/21/07/05/sycl-summer-sessions-call-for-presentations',
    redirectTo: 'news/2021/07/05/sycl-summer-sessions-call-for-presentations'
  },
  {
    path: 'news/21/07/09/oneapi-developer-summit-videos-available',
    redirectTo: 'news/2021/07/09/oneapi-developer-summit-videos-available'
  },
  {
    path: 'news/21/08/12/a-big-step-forward-moving-ginkgo-to-sycl',
    redirectTo: 'news/2021/08/12/a-big-step-forward-moving-ginkgo-to-sycl'
  },
  {
    path: 'news/21/09/13/argonne-s-44-petaflops-polaris-supercomputer-will-support-sycl',
    redirectTo: 'news/2021/09/13/argonne-s-44-petaflops-polaris-supercomputer-will-support-sycl'
  },
  {
    path: 'news/21/09/23/gromacs-adopts-hipsycl-for-future-amd-gpu-support',
    redirectTo: 'news/2021/09/23/gromacs-adopts-hipsycl-for-future-amd-gpu-support'
  },
  {
    path: 'news/21/10/04/huawei-news-huawei-releases-the-beiming-architecture-with-sycl',
    redirectTo: 'news/2021/10/04/huawei-news-huawei-releases-the-beiming-architecture-with-sycl'
  },
  {
    path: 'news/21/10/05/sycl-summer-sessions-videos-live',
    redirectTo: 'news/2021/10/05/sycl-summer-sessions-videos-live'
  },
  {
    path: 'news/21/11/09/enccs-sycl-workshop',
    redirectTo: 'news/2021/11/09/enccs-sycl-workshop'
  },
  {
    path: 'news/21/11/09/join-the-oneapi-developer-summit-at-sc21',
    redirectTo: 'news/2021/11/09/join-the-oneapi-developer-summit-at-sc21'
  },
  {
    path: 'news/21/11/24/encc-sycl-workshop',
    redirectTo: 'news/2021/11/24/encc-sycl-workshop'
  },
  {
    path: 'news/21/11/24/videos-from-the-oneapi-developer-summit',
    redirectTo: 'news/2021/11/24/videos-from-the-oneapi-developer-summit'
  },
  {
    path: 'news/21/11/29/performance-portable-distributed-knn-using-lsh-and-sycl',
    redirectTo: 'news/2021/11/29/performance-portable-distributed-knn-using-lsh-and-sycl'
  },
  {
    path: 'news/21/11/29/researchers-migrating-to-sycl-at-sc21',
    redirectTo: 'news/2021/11/29/researchers-migrating-to-sycl-at-sc21'
  },
  {
    path: 'news/21/12/09/solving-heterogeneous-programming-challenges-with-sycl',
    redirectTo: 'news/2021/12/09/solving-heterogeneous-programming-challenges-with-sycl'
  },
  {
    path: 'news/21/12/17/an-introduction-to-sycl-programming',
    redirectTo: 'news/2021/12/17/an-introduction-to-sycl-programming'
  },
  {
    path: 'news/21/12/17/write-your-first-sycl-app-in-less-than-30-minutes',
    redirectTo: 'news/2021/12/17/write-your-first-sycl-app-in-less-than-30-minutes'
  },
  {
    path: 'news/21/12/22/aurora-sycl-hands-on-sessions-announced',
    redirectTo: 'news/2021/12/22/aurora-sycl-hands-on-sessions-announced'
  },
  {
    path: 'news/22/01/05/exascale-alcf-and-intel-to-host-aurora-learning-paths-series',
    redirectTo: 'news/2022/01/05/exascale-alcf-and-intel-to-host-aurora-learning-paths-series'
  },
  {
    path: 'news/22/01/18/iwocl-syclcon-call-for-presentations-and-poster-sessions',
    redirectTo: 'news/2022/01/18/iwocl-syclcon-call-for-presentations-and-poster-sessions'
  },
  {
    path: 'news/22/01/21/developing-the-blake3-hashing-algorithm-with-sycl',
    redirectTo: 'news/2022/01/21/developing-the-blake3-hashing-algorithm-with-sycl'
  },
  {
    path: 'news/22/02/02/five-outstanding-additions-found-in-sycl-2020',
    redirectTo: 'news/2022/02/02/five-outstanding-additions-found-in-sycl-2020'
  },
  {
    path: 'news/22/02/08/sycl-the-heart-of-oneapi',
    redirectTo: 'news/2022/02/08/sycl-the-heart-of-oneapi'
  },
  {
    path: 'news/22/02/08/using-supercomputers-to-understand-biomolecular-properties',
    redirectTo: 'news/2022/02/08/using-supercomputers-to-understand-biomolecular-properties'
  },
  {
    path: 'news/22/02/10/getting-started-with-cross-platform-heterogeneous-computing-using-sycl',
    redirectTo: 'news/2022/02/10/getting-started-with-cross-platform-heterogeneous-computing-using-sycl'
  },
  {
    path: 'news/22/02/10/heterogeneous-hardware-needs-universal-software',
    redirectTo: 'news/2022/02/10/heterogeneous-hardware-needs-universal-software'
  },
  {
    path: 'news/22/02/22/sycl-session-episode-1-accelerating-simulations-for-the-large-hadron-collider',
    redirectTo: 'news/2022/02/22/sycl-session-episode-1-accelerating-simulations-for-the-large-hadron-collider'
  },
  {
    path: 'news/22/03/22/an-introduction-to-programming-with-sycl-on-perlmutter-and-beyond',
    redirectTo: 'news/2022/03/22/an-introduction-to-programming-with-sycl-on-perlmutter-and-beyond'
  },
  {
    path: 'news/22/03/25/raytracing-from-cuda-to-sycl-2020',
    redirectTo: 'news/2022/03/25/raytracing-from-cuda-to-sycl-2020'
  },
  {
    path: 'news/22/04/14/sycl-support-in-blender-under-review',
    redirectTo: 'news/2022/04/14/sycl-support-in-blender-under-review'
  },
  {
    path: 'news/22/05/10/migrating-the-jacobi-iterative-method-from-cuda-to-sycl',
    redirectTo: 'news/2022/05/10/migrating-the-jacobi-iterative-method-from-cuda-to-sycl'
  },
  {
    path: 'news/22/05/10/gromacs-2022-advances-open-source-drug-discovery-with-sycl-and-oneapi',
    redirectTo: 'news/2022/05/10/gromacs-2022-advances-open-source-drug-discovery-with-sycl-and-oneapi'
  },
  {
    path: 'news/22/05/12/syclcon-presentations-are-available-on-demand',
    redirectTo: 'news/2022/05/12/syclcon-presentations-are-available-on-demand'
  },
  {
    path: 'news/22/05/30/open-source-syclomatic',
    redirectTo: 'news/2022/05/30/open-source-syclomatic'
  },
  {
    path: 'news/22/06/06/complete-the-sycl-developer-survey',
    redirectTo: 'news/2022/06/06/complete-the-sycl-developer-survey'
  },
  {
    path: 'news/22/06/14/intel-takes-the-sycl-to-nvidia-s-cuda-with-migration-tool',
    redirectTo: 'news/2022/06/14/intel-takes-the-sycl-to-nvidia-s-cuda-with-migration-tool'
  },
  {
    path: 'news/22/06/14/podcast-sycl-empowering-developers-in-academia-and-enterprise',
    redirectTo: 'news/2022/06/14/podcast-sycl-empowering-developers-in-academia-and-enterprise'
  },
  {
    path: 'news/22/06/29/how-to-port-your-code-from-cuda-to-sycl-targeting-nvidia-gpus-and-more',
    redirectTo: 'news/2022/06/29/how-to-port-your-code-from-cuda-to-sycl-targeting-nvidia-gpus-and-more'
  },
  {
    path: 'news/22/07/18/accelerating-made-simpler-with-celerity',
    redirectTo: 'news/2022/07/18/accelerating-made-simpler-with-celerity'
  },
  {
    path: 'news/22/07/25/intel-arc-gpus-and-oneapi-do-they-sycl',
    redirectTo: 'news/2022/07/25/intel-arc-gpus-and-oneapi-do-they-sycl'
  },
  {
    path: 'news/22/08/09/how-open-acceleration-standards-are-driving-safety-critical-development',
    redirectTo: 'news/2022/08/09/how-open-acceleration-standards-are-driving-safety-critical-development'
  },
  {
    path: 'news/22/09/06/the-game-of-life-an-example-of-local-memory-usage-and-hierarchical-kernels-in-sycl',
    redirectTo: 'news/2022/09/06/the-game-of-life-an-example-of-local-memory-usage-and-hierarchical-kernels-in-sycl'
  },
  {
    path: 'news/22/09/06/open-source-syclomatic-tool-for-converting-cuda-to-sycl',
    redirectTo: 'news/2022/09/06/open-source-syclomatic-tool-for-converting-cuda-to-sycl'
  },
  {
    path: 'news/22/12/19/write-sycl-code-and-use-oneapi-to-target-nvidia-and-amd-gpus-with-free-binary-plugins',
    redirectTo: 'news/2022/12/19/write-sycl-code-and-use-oneapi-to-target-nvidia-and-amd-gpus-with-free-binary-plugins'
  },
  {
    path: 'news/23/01/05/stfc-to-accelerate-exascale-software-in-computational-fluid-dynamics-and-code-coupling-using-sycl',
    redirectTo: 'news/2023/01/05/stfc-to-accelerate-exascale-software-in-computational-fluid-dynamics-and-code-coupling-using-sycl'
  },
  {
    path: 'news/23/02/23/gromacs-2023-released-with-better-sycl-for-intel-amd-nvidia',
    redirectTo: 'news/2023/02/23/gromacs-2023-released-with-better-sycl-for-intel-amd-nvidia'
  },
  {
    path: 'news/23/02/24/developing-sycl-for-next-generation-supercomputers',
    redirectTo: 'news/2023/02/24/developing-sycl-for-next-generation-supercomputers'
  },
  {
    path: 'news/23/02/24/hipsycl-becomes-open-sycl-for-targeting-all-major-cpus-and-gpus',
    redirectTo: 'news/2023/02/24/hipsycl-becomes-open-sycl-for-targeting-all-major-cpus-and-gpus'
  },
  {
    path: 'news/23/02/24/the-evolution-of-different-sycl-implementations',
    redirectTo: 'news/2023/02/24/the-evolution-of-different-sycl-implementations'
  },
  {
    path: 'news/23/03/02/ecp-bof-showcases-sycl',
    redirectTo: 'news/2023/03/02/ecp-bof-showcases-sycl'
  },
  {
    path: 'news/23/03/16/khronos-to-create-sycl-sc-open-standard-for-safety-critical-c-based-heterogeneous-compute',
    redirectTo: 'news/2023/03/16/khronos-to-create-sycl-sc-open-standard-for-safety-critical-c-based-heterogeneous-compute'
  },
  {
    path: 'news/23/04/07/user-driven-kernel-fusion',
    redirectTo: 'news/2023/04/07/user-driven-kernel-fusion'
  },
  {
    path: 'news/23/04/07/sycl-performance-for-nvidia-and-amd-gpus-matches-native-system-language',
    redirectTo: 'news/2023/04/07/sycl-performance-for-nvidia-and-amd-gpus-matches-native-system-language'
  },
  {
    path: 'news/23/05/11/8-leading-european-organisations-join-forces-to-bring-together-risc-v-and-sycl-standards',
    redirectTo: 'news/2023/05/11/8-leading-european-organisations-join-forces-to-bring-together-risc-v-and-sycl-standards'
  },
  {
    path: 'news/23/08/31/samsung-sycl-pim-processing-in-memory-technology-at-hot-chips-2023',
    redirectTo: 'news/2023/08/31/samsung-sycl-pim-processing-in-memory-technology-at-hot-chips-2023'
  },
  {
    path: 'news/23/11/13/exascale-computing-project-at-the-university-of-cambridge-uses-khronos-sycl-standard',
    redirectTo: 'news/2023/11/13/exascale-computing-project-at-the-university-of-cambridge-uses-khronos-sycl-standard'
  },
  {
    path: 'news/24/01/31/c-dac-achieves-1-75x-performance-improvement-on-seismic-code-migration',
    redirectTo: 'news/2024/01/31/c-dac-achieves-1-75x-performance-improvement-on-seismic-code-migration'
  },
  {
    path: 'news/24/01/31/sycl-graphs',
    redirectTo: 'news/2024/01/31/sycl-graphs'
  },
  {
    path: 'news/24/02/06/teaching-sycl-at-durham',
    redirectTo: 'news/2024/02/06/teaching-sycl-at-durham'
  },
  {
    path: 'news/24/06/20/sycl-in-the-edge-performance-and-energy-evaluation-for-heterogeneous-acceleration',
    redirectTo: 'news/2024/06/20/sycl-in-the-edge-performance-and-energy-evaluation-for-heterogeneous-acceleration'
  },
  {
    path: 'news/24/06/20/uxl-foundation-and-khronos-collaborate-on-the-sycl-open-standard-for-c-programming',
    redirectTo: 'news/2024/06/20/uxl-foundation-and-khronos-collaborate-on-the-sycl-open-standard-for-c-programming'
  },
  {
    path: 'news/24/06/20/learn-sycl-in-an-hour-maybe-less',
    redirectTo: 'news/2024/06/20/learn-sycl-in-an-hour-maybe-less'
  },
  {
    path: 'projects/16/05/26/eigen-c-template-library',
    redirectTo: 'ecosystem/projects'
  },
  {
    path: 'projects/16/09/12/sycl-opencl-openmp-benchmark',
    redirectTo: 'ecosystem/projects'
  },
  {
    path: 'projects/16/09/12/trisycl',
    redirectTo: 'ecosystem/projects'
  },
  {
    path: 'projects/16/09/15/visionc',
    redirectTo: 'ecosystem/projects'
  },
  {
    path: 'projects/17/01/19/tensorflow-using-opencl-devices',
    redirectTo: 'ecosystem/projects'
  },
  {
    path: 'projects/17/01/19/sycl-gtx',
    redirectTo: 'ecosystem/projects'
  },
  {
    path: 'projects/17/03/15/sycl-eigen-starter-project',
    redirectTo: 'ecosystem/projects'
  },
  {
    path: 'projects/17/09/22/sycl-cc',
    redirectTo: 'ecosystem/projects'
  },
  {
    path: 'projects/17/09/22/sycl-ml',
    redirectTo: 'ecosystem/projects'
  },
  {
    path: 'projects/18/01/25/slambench-with-sycl-kernels',
    redirectTo: 'ecosystem/projects'
  },
  {
    path: 'projects/18/01/25/dagr',
    redirectTo: 'ecosystem/projects'
  },
  {
    path: 'projects/18/11/20/sycl-prng',
    redirectTo: 'ecosystem/projects'
  },
  {
    path: 'projects/18/11/23/ray-tracing-renderer-performance-comparison',
    redirectTo: 'ecosystem/projects'
  },
  {
    path: 'projects/18/11/23/sycl-buffer-benchmark',
    redirectTo: 'ecosystem/projects'
  },
  {
    path: 'projects/18/11/23/sycl-parallelstl-benchmark',
    redirectTo: 'ecosystem/projects'
  },
  {
    path: 'projects/18/11/23/high-level-c-for-accelerator-clusters',
    redirectTo: 'ecosystem/projects'
  },
  {
    path: 'projects/18/11/23/opencl-and-sycl-codexl-project',
    redirectTo: 'ecosystem/projects'
  },
  {
    path: 'projects/18/11/23/rsbench',
    redirectTo: 'ecosystem/projects'
  },
  {
    path: 'projects/19/03/11/a-portable-gpu-path-tracer-library-running-powered-by-sycl',
    redirectTo: 'ecosystem/projects'
  },
  {
    path: 'projects/19/03/11/hipsycl',
    redirectTo: 'ecosystem/projects'
  },
  {
    path: 'projects/19/03/11/opengl-mathematics-glm',
    redirectTo: 'ecosystem/projects'
  },
  {
    path: 'projects/19/04/19/sycl-parallel-stl',
    redirectTo: 'ecosystem/projects'
  },
  {
    path: 'projects/19/05/20/computec-sdk',
    redirectTo: 'ecosystem/projects'
  },
  {
    path: 'projects/19/05/22/sycl-blas',
    redirectTo: 'ecosystem/projects'
  },
  {
    path: 'projects/19/05/23/sycl-dnn',
    redirectTo: 'ecosystem/projects'
  },
  {
    path: 'videos/16/05/26/sig2015-heterogeneous-computing',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/16/05/26/sycl-1-2-unofficial-high-level-overview',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/16/05/26/iwocl-2015-sycl-and-opencl',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/16/05/26/c-on-accelerators',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/16/05/26/iwocl-2015-kernel-composition-in-sycl',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/16/08/29/opencl-sycl-spir-v-bof-siggraph-2016',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/16/10/03/ccon-2016-gordon-brown-michael-wong-towards-heterogeneous-programming-in-c',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/16/10/03/open-standards-for-adas-andrew-richards-codeplay-at-autosens-2016',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/16/12/15/heterogeneous-c-dispatch-comparing-sycl-to-hpx-kokkos-raja',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/16/12/15/khronos-sycl-parallel-stl-open-source-project',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/16/12/15/getting-hands-on-with-sycl-using-computec',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/17/01/18/sycl-building-blocks-for-c-libraries-gordon-brown-meeting-c-2016',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/17/02/20/visionc-demos-using-sycl',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/17/08/23/using-sycl-for-automotive-development',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/17/09/28/sycl-at-siggraph-2017',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/17/09/28/mehdi-goli-accelerating-eigen-tensor-libraries-using-sycl',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/17/11/14/building-machine-learning-applications-for-mobile-and-embedded-devices',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/17/11/14/ccon-2017-c17-parallelstl-a-standardization-experience-report-for-cpu-and-gpu-on-sycl',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/17/12/01/machine-learning-using-heterogeneous-c-and-sycl',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/17/12/01/an-overview-of-sycl-computec-at-sc17',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/17/12/01/parallel-stl-for-cpu-and-gpu-with-sycl',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/17/12/01/single-source-sycl-c-on-xilinx-fpga',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/17/12/01/tensorflow-with-sycl-and-trisycl',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/17/12/13/single-source-sycl-c-on-a-xilinx-fpga',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/18/01/09/enabling-opencl-and-sycl-for-autonomous-vehicles',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/18/03/15/open-standards-sycl-and-opencl-in-a-new-automotive-era',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/18/04/24/sycl-c-to-the-rescue-of-soc-programmability',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/18/05/01/heterogeneous-programming-in-c-today-accu-2018',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/18/10/01/ccast-episode-164-sycl-with-gordon-brown',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/18/11/05/pacific-2018-christopher-di-bella-introducing-parallelism-to-the-ranges-ts',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/18/11/12/a-modern-c-programming-model-for-gpus-using-khronos-sycl',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/18/11/22/profiling-sycl-applications-with-codexl',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/18/12/03/an-open-source-compute-stack-that-includes-sycl',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/19/01/28/but-mummy-i-don-t-want-to-use-cuda-open-source-gpu-compute',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/19/04/29/2019-eurollvm-meeting-sycl-compiler-zero-cost-abstraction-and-type',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/19/06/17/sycl-and-opencl-at-embedded-vision-summit',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/19/06/17/intel-open-source-sycl-compiler-project',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/19/09/16/codeplays-andrew-richards-examines-safe-autonomous-vehicle-ai',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/19/10/24/codeplays-gordon-brown-ccon19',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/19/11/17/intro-oneapi',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/19/11/17/overview-oneapi',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/20/01/17/tf-sycl',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/20/02/17/discover-one-api',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/20/03/06/argonne-sycl',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/20/03/06/dpc-intro',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/20/04/28/iwocl-biometrics',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/20/04/28/sycl-profiling',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/20/04/28/nvidia-sycl',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/20/04/28/sycl-2020',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/20/04/28/iwocl-hipsycl',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/20/04/28/iwocl-sycl-bench',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/20/04/28/iwocl-sycl-performance-bench',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/20/04/28/iwocl-sycl-state-of-union',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/20/04/28/iwocl-dpc',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/20/04/28/iwocl-dpc-debug',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/20/04/28/iwocl-argonne-hipsycl',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/20/04/28/iwocl-argonne-keynote',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/20/04/28/iwocl-evaluation-image',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/20/04/28/iwocl-usm',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/20/04/28/iwocl-offload-advisor',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/20/06/15/programacao-paralela-sycl',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/20/06/22/exascale-computing-project-intro-to-sycl',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/20/06/26/improving-the-performance-of-medical-imaging-applications-using-sycl',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/20/08/05/introduction-to-sycl',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/20/08/28/sycl-bench',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/20/08/31/sycl-sessions-kumudha',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/20/09/01/sycl-sessions-jeff',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/20/09/02/sycl-sessions-tom',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/20/09/03/sycl-sessions-jan',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/20/09/04/sycl-sessions-philip',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/20/09/30/early-results-bristol-performance-study',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/20/09/30/sycl-kernels-across-architectures',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/20/09/30/tuning-sycl-libraries',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/20/09/30/wilson-dslash-kernel',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/20/09/30/excalibur-sle-workshop',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/20/09/30/heterogeneous-parallel-programming-with-open-standards',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/20/11/18/heterogeneous-programming-in-c-with-sycl-2020',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/20/12/15/building-an-open-ai-hpc-ecosystem',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/21/01/06/open-standards-for-embedded-ai-software-deployment',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/21/01/20/sycl-bench-a-versatile-cross-platform-benchmark-suite-for-heterogeneous-computing',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/21/02/01/turbulence-at-the-exascale-podcast',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/21/03/25/migrating-from-cuda-only-to-multi-platform-dpc',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/21/04/15/aurora-early-adopter-series-sycl-2020-dpc-improvements-to-the-sycl-programming-model',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/21/05/04/syclcon-2021-sycl-panel-session',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/21/09/13/sycl-queues-xpublog-intel-software',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/21/11/24/enccs-training-sycl-workshop',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/21/11/24/sycl-heterogeneous-programming-for-oneapi-dev-summit-china',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/21/12/22/ccon-2021-heterogeneous-modern-c-with-sycl-2020',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/21/12/22/ccon-2020-programming-in-modern-c-with-sycl-2020',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/21/12/22/advanced-gromacs-using-oneapi-and-sycl-across-multi-architectures',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/21/12/22/enccs-sycl-workshop',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/21/12/22/risc-v-days-tokyo-2021-autumn-expectations-for-a-software-development-environment-ecosystem-centered-on-opencl-sycl',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/21/12/22/accelerating-real-world-ai-software-using-the-risc-v-vector-extension',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/21/12/22/khronos-sycl-webinar',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/22/02/21/optimization-best-practices-using-sycl',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/22/02/22/sycl-session-with-rod-burns-dr-tom-deakin-and-guest-dr-vincent-pascuzzi',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/22/03/02/c20-on-xilinx-fpga-with-sycl-for-vitis',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/22/03/23/devcon-alliance-oneapi-and-sycl',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/22/04/13/accelerators-at-the-cern-atlas-experiment',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/22/05/30/on-the-compilation-performance-of-current-sycl-implementations',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/22/05/30/syclcon-a-proof-of-concept-sycl-fft',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/22/05/30/syclcon-celerity',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/22/05/30/syclcon-comparison-sycl-opencl-cuda-openmp',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/22/05/30/syclcon-interfacing-sycl-and-python-for-xpu-programming',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/22/05/30/syclcon-optimize-ai-pipelines-with-sycl',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/22/05/30/syclcon-sycl-concurrency-on-gpu-platforms-empirical-measurement',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/22/05/30/syclcon-syclops-a-sycl-specific-llvm-to-mlir-converter',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/22/05/30/syclcon-syclsc',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/22/05/30/syclcon-towards-a-portable-drug-discovery-pipeline-with-sycl-2020',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/22/05/30/syclcon-towards-performance-portability-of-ai-models-using-sycl-dnn',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/22/05/30/syclcon-untangling-modern-programming-models',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/22/06/13/enccs-sycl-workshop',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/22/07/11/workshop-advanced-sycl-concepts-for-heterogenous-computing',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/22/09/06/c-on-sea-sycl-open-your-code-to-more-hardware-choices-igor-vorobtsov',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/22/12/19/gpu-performance-portability-using-standard-c-with-sycl',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/22/12/19/sycl-the-future-is-open-parallel-and-heterogenous',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/22/12/19/syclomatic-cuda-to-sycl-automatic-migration-tool',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/22/12/19/cuda-to-sycl-migration-tool-and-method',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/22/12/19/tuomas-koskela-development-of-portable-scientific-applications-using-sycl',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/23/04/03/run-sycl-code-on-nvidia-and-amd-gpus-with-oneapi-and-dpc',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/23/05/11/crowd-simulation-on-multiple-devices-using-sycl',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/23/05/15/sycl-and-celerity-high-ish-level-vendor-independent-c-for-gpu-parallelism',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/23/06/01/syclcon-23-the-first-single-pass-sycl-compiler-with-unified-code-representation-across-backends',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/23/06/01/syclcon-23-comparing-the-performance-of-sycl-runtimes-for-molecular-dynamics-applications',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/23/06/01/syclcon-23-syclomatic-compatibility-library-making-migration-to-sycl-easier',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/23/06/01/syclcon-23-particle-track-reconstruction-on-heterogeneous-platforms-with-sycl',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/23/06/01/syclcon-23-a-sycl-extension-for-user-driven-online-kernel-fusion',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/23/06/01/syclcon-23-porting-sycl-accelerated-neural-network-frameworks-to-edge-devices',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/23/06/01/syclcon-23-welcome-and-an-introduction-to-the-use-of-sycl-at-the-cambridge-open-zettascale-lab',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/23/06/01/syclcon-23-panel-discussion-opencl-and-sycl',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/23/06/01/syclcon-23-panel-discussion-machine-learning-with-opencl-and-sycl',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/23/06/01/syclcon-23-standardizing-complex-numbers-in-sycl',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/23/08/28/khronos-sycl-language-framework-for-c-accelerators',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/23/08/28/sycl-sub-groups',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/23/09/13/consea-2023-a-smooth-introduction-to-sycl',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/24/02/22/optimization-best-practices-using-sycl',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/24/03/05/khronos-apis-for-heterogeneous-compute-and-safety-sycl-and-sycl-sc-ccon-2023',
    redirectTo: 'ecosystem/presentations'
  },
  {
    path: 'videos/24/06/20/application-perspective-on-sycl-a-modern-programming-model-for-performance-and-portability',
    redirectTo: 'ecosystem/presentations'
  }
];
