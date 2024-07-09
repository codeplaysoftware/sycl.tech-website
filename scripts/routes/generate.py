#!/usr/bin/env python3

#
#   Copyright (C) Codeplay Software Limited.
#
#   Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use these files except in compliance with the License.
#   You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#   For your convenience, a copy of the License has been included in this
#   repository.
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.
#

import json
import sys
import requests


def load_json_feed(base_url: str, content_type: str, page: int = 0):
    file_name = 'feed' if page == 0 else f'{page}'
    url = f'{base_url}/{content_type}/{file_name}.json'

    response = requests.get(url)

    if response.status_code != 200:
        raise ConnectionError(f'{response.status_code} HTTP error code found for URL "{url}".')

    return json.loads(response.content)


def load_all_feed_items(base_url: str, content_type: str):
    feed_items = []
    current_page = 0

    while True:
        content = load_json_feed(base_url, content_type, current_page)
        feed_items += content['items']

        if 'next_url' not in content:
            break

        current_page += 1

    return feed_items


def fetch_news_routes(base_url: str):
    routes = []

    for item in load_all_feed_items(base_url, 'news'):
        tag_parts = item['_tag'].split('-', 3)
        routes.append(f'/news/{tag_parts[0]}/{tag_parts[1]}/{tag_parts[2]}/{tag_parts[3]}')

    return routes


def fetch_contributor_routes(base_url: str):
    routes = []

    for item in load_all_feed_items(base_url, 'contributors'):
        routes.append(f'/contributors/{item["_username"]}')

    return routes


def fetch_academy_routes(base_url: str):
    routes = []

    for item in load_all_feed_items(base_url, 'academy_lessons'):
        routes.append(f'/getting-started/academy/{item["_tag"]}')

        if '_lesson' in item:
            routes.append(f'/getting-started/academy/{item["_tag"]}/lesson')

        if '_source' in item:
            routes.append(f'/getting-started/academy/{item["_tag"]}/source')

        if '_solution' in item:
            routes.append(f'/getting-started/academy/{item["_tag"]}/solution')

    return routes


def generate(base_url: str):
    routes = fetch_academy_routes(base_url) + fetch_news_routes(base_url) + fetch_contributor_routes(base_url)
    return '\n'.join(routes)


if __name__ == '__main__':
    args = sys.argv[1:]

    try:
        if not args:
            raise ValueError('Please provide a valid feed base URL as input to this script.')

        print(generate(args[0]))
    except Exception as e:
        print(str(e))
        quit(1)
