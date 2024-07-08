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

import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

const cache: Map<string, Observable<HttpEvent<any>>> = new Map();

/**
 * Enables caching to avoid sending multiple identical requests to the backend.
 * @param req
 * @param next
 */
export const httpCacheInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  if (req.method !== 'GET') {
    return next(req);
  }

  // Fetch from the cache (can be undefined)
  const cachedResponse = cache.get(req.urlWithParams);

  if (cachedResponse) {
    return cachedResponse;
  }

  const observable = next(req).pipe(
    shareReplay() // Needed to ensure all subscribers receive a cache copy
  );

  // Add to the cache
  cache.set(req.urlWithParams, observable);

  return observable;
}
