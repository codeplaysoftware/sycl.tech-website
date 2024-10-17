import { Params } from '@angular/router';
import {
  FeedFilter,
  FeedPropertyFilter,
  FeedPropertyGroupFilter
} from './FilterableService';

/**
 * Provides functionality to map between FeedFilter's, UIFilterGroup's and Params.
 */
export class FilterManager {
  /**
   * Converts an array of UIFilterGroup into Params.
   * @param filterGroups
   */
  static convertFiltersToParams(filterGroups: UIFilter[]): Params {
    const params: Params = {};

    for (const filterGroup of filterGroups) {
      const value = filterGroup.toParamValue();

      if (value) {
        params[filterGroup.name] = filterGroup.toParamValue();
      }
    }

    return params;
  }

  /**
   * Merges the values from a Params instance into the provided UIFilterGroup's.
   * @param filters
   * @param queryParams
   */
  static mergeFiltersAndParams(filters: UIFilter[], queryParams: Params) {
    for (const filterGroup of filters) {
      for (const queryParamName in queryParams) {
        if (filterGroup.name != queryParamName) {
          continue;
        }

        if (Object.keys(queryParams).length == 0) {
          continue
        }

        filterGroup.injectFromParamValue(queryParams[queryParamName]);
      }
    }

    return filters;
  }

  /**
   * Converts an array of UIFilterGroup and provided Params into an array of FeedFilter's.
   * @param filterGroups
   * @param queryParams
   */
  static convertFiltersToFeedFilters(filterGroups: UIFilter[], queryParams?: Params): FeedFilter[] {
    const feedFilters: Map<string, FeedFilter> = new Map();

    for (const filterGroup of filterGroups) {
      feedFilters.set(filterGroup.name, filterGroup.convertToFeedFilter());
    }

    if (queryParams) {
      for (const paramName in queryParams) {
        const feedFilter = feedFilters.get(paramName);

        if (!feedFilter) {
          feedFilters.set(paramName, new FeedPropertyGroupFilter(paramName, queryParams[paramName]));
        }
      }
    }

    return Array.from(feedFilters.values());
  }

  /**
   * Converts from an array of FeedFilter into an array of UIFilterGroup.
   * @param feedFilters
   */
  static convertFromFeedFilters(feedFilters: FeedFilter[]): UIFilter[] {
    const filterGroups: UIFilter[] = [];

    for (const filter of feedFilters) {
      if (filter instanceof FeedPropertyFilter && filter.propertyName == '*') {
        filterGroups.push(new UISearchFilter());
      } else if (filter instanceof FeedPropertyGroupFilter) {
        const tagGroup = new UITagGroup(filter.propertyName);
        tagGroup.inject(filter.requiredValues);

        filterGroups.push(tagGroup);
      }
    }

    return filterGroups;
  }
}

/**
 * Allows the implementing instance to be able to correctly serialize and deserialize from Params.
 */
export interface IParamSerializable {
  injectFromParamValue(paramValue: any): void;
  toParamValue(): any;
}

/**
 * Allows the implementing instance to be able to convert its instance into a FeedFilter.
 */
export interface IFeedFilterSerializable {
  convertToFeedFilter(): FeedFilter;
}

/**
 * Represents a generic base class for providing UI filters.
 */
export abstract class UIFilter implements IParamSerializable, IFeedFilterSerializable {
  /**
   * Constructor.
   * @param name
   * @param value
   * @protected
   */
  protected constructor(
    public name: string,
    public value?: any
  ) { }

  /**
   * @inheritdoc
   */
  abstract injectFromParamValue(paramValue: any): void;

  /**
   * @inheritdoc
   */
  abstract toParamValue(): any;

  /**
   * @inheritdoc
   */
  abstract convertToFeedFilter(): FeedFilter;
}

/**
 * Represents a search filter for the UI.
 */
export class UISearchFilter extends UIFilter {
  /**
   * Constructor.
   * @param value
   */
  constructor(value?: string) {
    super('Search', value);
  }

  /**
   * @inheritdoc
   */
  injectFromParamValue(paramValue: string): void {
    this.value = paramValue;
  }

  /**
   * @inheritdoc
   */
  toParamValue(): any {
    return this.value;
  }

  /**
   * @inheritdoc
   */
  convertToFeedFilter(): FeedFilter {
    return new FeedPropertyFilter('*', this.value);
  }
}

/**
 * Represents a group of UITag's in a group.
 */
export class UITagGroup extends UIFilter {
  public tags: Map<string, UITag> = new Map();

  /**
   * Constructor.
   * @param name
   * @param value
   */
  constructor(
    name: string,
    value?: string
  ) {
    super(name);

    if (value) {
      this.injectFromParamValue(value);
    }
  }

  /**
   * @inheritdoc
   */
  injectFromParamValue(paramValue: any): void {
    if (!Array.isArray(paramValue)) {
      paramValue = [paramValue];
    }

    for (const innerValue of paramValue) {
      this.tags.set(innerValue, {
        name: innerValue, value: true
      });
    }
  }

  /**
   * @inheritdoc
   */
  toParamValue(): any {
    return this.getTags(true)
      .map(tagFilter => tagFilter.name);
  }

  /**
   * @inheritdoc
   */
  convertToFeedFilter(): FeedFilter {
    return new FeedPropertyGroupFilter(
      this.name, this.getTags(true).map(tagFilter => tagFilter.name));
  }

  /**
   * Get a array of UITag's.
   * @param enabledOnly
   */
  getTags(enabledOnly: boolean = false): UITag[] {
    return Array.from(this.tags.values())
      .filter((tag: UITag) => !(enabledOnly && !tag.value));
  }

  /**
   * Add a new tag.
   * @param name
   * @param value
   */
  add(name: string, value: boolean) {
    this.tags.set(name, {
      name: name,
      value: value
    });
  }

  /**
   * Inject values form an array into tags with a default value.
   * @param items
   * @param defaultValue
   */
  inject(items: string[], defaultValue: boolean = false) {
    for (const item of items) {
      this.add(item, defaultValue);
    }
  }
}

/**
 * Represents a UI tag.
 */
export interface UITag {
  name: string
  value: boolean
}
