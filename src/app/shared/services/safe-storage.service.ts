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

import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SafeStorageService {
  public static readonly STORAGE_ALLOWED_KEY = 'st-cookies-accepted';
  private readonly subject: BehaviorSubject<State>;
  private readonly allowedStorageKeys: string[] = environment.allowed_storage_keys;

  protected readonly enableByDefault = [
    'st-enable-tracking',
    'st-enable-alerts'
  ]

  /**
   * Constructor.
   * @param storageService
   */
  constructor(
    @Inject(LOCAL_STORAGE) private storageService: StorageService
  ) {
    this.subject = new BehaviorSubject(this.state());
  }

  /**
   * Determine if we are allowed to store data to the storage service.
   */
  allowed(): boolean {
    return this.storageService.has(SafeStorageService.STORAGE_ALLOWED_KEY)
      && this.storageService.get(SafeStorageService.STORAGE_ALLOWED_KEY) == true;
  }

  /**
   * Return an observable, allowing changes to the state to be tracked.
   */
  observe(): Observable<State> {
    return this.subject;
  }

  /**
   * Clear all the saved state, persisting if storage is allowed or not.
   */
  clear(key?: string) {
    if (key) {
      this.storageService.remove(key);
    } else {
      this.storageService.clear();
    }
  }

  /**
   * Set if we are allowed or not to store data to the storage service.
   */
  setStorageAllowed(enable: boolean) {
    if (enable) {
      for (const key of this.enableByDefault) {
        this.storageService.set(key, enable);
      }
    } else {
      this.clear();
    }

    this.storageService.set(SafeStorageService.STORAGE_ALLOWED_KEY, enable);
    this.notify();
  }

  /**
   * Save a value to the safe storage service.
   * @param key the key to use to save and access the value
   * @param value the value to store
   * @throws DefaultStorageKeys will be thrown if we are not allowed to store data
   */
  save(
    key: string,
    value: any
  ) {
    // If the key is the STORAGE_ALLOWED_KEY, handle this separately
    if (key == SafeStorageService.STORAGE_ALLOWED_KEY) {
      this.setStorageAllowed(value);
      return ;
    }

    // Check if we are allowed to store to the storage service. We would be denied if the user has not allowed
    // cookies/storage.
    if (!this.allowed()) {
      throw new StorageNotEnabledError('The storage service is not enabled.');
    }

    // Check if the key is in the allowed list of keys, this prevents us storing something we haven't declared
    if (!this.allowedStorageKeys.includes(key)) {
      throw new KeyNotAllowedError(`The key "${key}" is not in the allowed key list.`);
    }

    this.storageService.set(key, value);

    // Notify any observers of change to the storage state
    this.notify();
  }

  /**
   * Check if the safe storage service contains a value.
   * @param key
   */
  has(
    key: string
  ): boolean {
    return this.storageService.has(key);
  }

  /**
   * Get a specific value using a key. Will return undefined if the key does not exist.
   * @param key
   */
  get(
    key: string
  ): any {
    return this.storageService.get(key);
  }

  /**
   * Get the current state of all known allowed keys.
   */
  private state() {
    const state: any = {};

    for (const key of this.allowedStorageKeys) {
      state[key] = this.storageService.get(key);
    }

    return state;
  }

  /**
   * Notify any observers of the new updated storage state.
   */
  private notify() {
    this.subject.next(this.state());
  }
}

/**
 * State interface.
 */
export interface State {
  [Key: string]: any;
}

/**
 * Thrown when we are not allowed to store data.
 */
export class StorageNotEnabledError extends Error {}

/**
 * Thrown when there is an attempt to store a value when it's not listed in the allowed key list.
 */
export class KeyNotAllowedError extends Error {}
