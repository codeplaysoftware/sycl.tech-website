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
 * A filter, to filter results.
 */
export class ResultFilter {
  /**
   * Constructor.
   * @param name
   * @param value
   * @param extras
   */
  constructor(
    public name: string,
    public value: any,
    public extras: any = {}
  ) { }

  /**
   * Check if the filter is active or not.
   */
  isValid(): boolean {
    if (typeof this.value == 'boolean' && !this.value) {
      return false;
    } else if (typeof this.value == 'string' && this.value.length <= 0) {
      return false;
    }

    return true;
  }

  /**
   * Return the type of the value of the filter.
   */
  getType(): string {
    if (Array.isArray(this.value)) {
      return 'array';
    } else if (this.value === null) {
      return 'null';
    } else if (this.value === undefined) {
      return 'undefined';
    } else {
      return typeof this.value;
    }
  }

  /**
   * Return the "real" value of this result. If it's a boolean, the real value would be the name of the filter.
   */
  getRealValue() {
    if (ResultFilter.guessType(this.value) == 'boolean') {
      return this.name
    }

    return this.value;
  }

  /**
   * Serialize to json.
   */
  toJson() {
    return JSON.stringify({
      'name': this.name,
      'value': this.value,
      'extras': this.extras ? this.extras : {}
    })
  }

  /**
   * Deserialize from JSON.
   * @param serialized
   */
  static fromJson(
    serialized: string
  ): ResultFilter {
    const deserialized = JSON.parse(serialized);

    return new ResultFilter(
      deserialized['name'], deserialized['value']);
  }

  /**
   * Return the type of the value of the filter.
   */
  static guessType(value: any): string {
    if (Array.isArray(value)) {
      return 'array';
    } else if (value === null) {
      return 'null';
    } else if (value === undefined) {
      return 'undefined';
    } else if (typeof value === 'object') {
      return 'object';
    } else {
      return typeof value;
    }
  }
}

/**
 * A filter group.
 */
export class FilterGroup {
  constructor(
    public name: string,
    public filters: ResultFilter[] = []
  ) { }

  /**
   * Check if one or more of the filters are valid. If no filters are valid, the filter group is also
   * considered invalid.
   */
  isValid(): boolean {
    for (const filter of this.filters) {
      if (filter.isValid()) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get all the valid filters.
   */
  getValid(): ResultFilter[] {
    return this.filters.filter(filter => filter.isValid());
  }

  /**
   * Serialize to JSON.
   */
  toJson(): string {
    const serialized = {
      'name': this.name,
      'filters': this.filters.map((filter) => {
        return filter.toJson()
      })
    }

    return JSON.stringify(serialized);
  }

  /**
   * Serialize from JSON.
   * @param serializedGroup
   */
  static fromJson(serializedGroup: string): FilterGroup {
    const deserialized = JSON.parse(serializedGroup);

    return new FilterGroup(
      deserialized['name'],
      deserialized['filters'].map((serializedFilter: string) => {
        return ResultFilter.fromJson(serializedFilter)
      }));
  }

  /**
   * Serialize an array of FilterGroup to a JSON string.
   * @param groups
   */
  static groupsToJson(groups: FilterGroup[]): string {
    return JSON.stringify(groups.map((group) => {
      return group.toJson();
    }));
  }

  /**
   * Deserialize from JSON to an array of FilterGroup.
   * @param serialized
   */
  static groupsFromJson(serialized: string) {
    const deserialized: [] = JSON.parse(serialized);
    return deserialized.map((serializedGroup) => {
      return FilterGroup.fromJson(serializedGroup);
    });
  }
}
