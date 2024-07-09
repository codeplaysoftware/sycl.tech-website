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
import { HomeComponent } from './pages/home/home.component';
import { GettingStartedComponent } from './pages/getting-started/getting-started.component';
import { ProjectsComponent } from './pages/ecosystem/projects/projects.component';
import { EcosystemComponent } from './pages/ecosystem/ecosystem.component';
import { NewsComponent } from './pages/news/news.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { LessonComponent } from './pages/getting-started/academy/lesson/lesson.component';
import { AcademyComponent } from './pages/getting-started/academy/academy.component';
import { ContributorsComponent } from './pages/contributors/contributors.component';
import { ContributorComponent } from './pages/contributors/view/contributor.component';
import { ResearchComponent } from './pages/ecosystem/research/research.component';
import { VideosComponent } from './pages/ecosystem/videos/videos.component';
import { ViewComponent } from './pages/news/view/view.component';
import { ImplementationsComponent } from './pages/ecosystem/implementations/implementations.component';
import { PlaygroundComponent } from './pages/playground/playground.component';
import { CookiesComponent } from './pages/cookies/cookies.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { Error404Component } from './pages/404/error-404.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'playground',
    component: PlaygroundComponent
  },
  {
    path: 'getting-started',
    component: GettingStartedComponent
  },
  {
    path: 'cookies',
    component: CookiesComponent
  },
  {
    path: 'privacy',
    component: PrivacyComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'getting-started/academy',
    component: AcademyComponent
  },
  {
    path: 'getting-started/academy/:lessonTag',
    component: LessonComponent
  },
  {
    path: 'getting-started/academy/:lessonTag/:tabName',
    component: LessonComponent
  },
  {
    path: 'ecosystem',
    component: EcosystemComponent
  },
  {
    path: 'ecosystem/projects',
    component: ProjectsComponent
  },
  {
    path: 'ecosystem/presentations',
    component: VideosComponent
  },
  {
    path: 'ecosystem/research',
    component: ResearchComponent
  },
  {
    path: 'ecosystem/implementations',
    component: ImplementationsComponent
  },
  {
    path: 'news',
    component: NewsComponent
  },
  {
    path: 'news/:year/:month/:day/:tag',
    component: ViewComponent
  },
  {
    path: 'calendar',
    component: CalendarComponent
  },
  {
    path: 'contributors',
    component: ContributorsComponent
  },
  {
    path: 'contributors/:username',
    component: ContributorComponent
  },
  {
    path: '404',
    component: Error404Component,
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '404'
  }
];
