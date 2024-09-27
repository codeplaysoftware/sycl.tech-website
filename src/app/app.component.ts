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

import { DOCUMENT, NgClass, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  Inject, OnDestroy,
  Renderer2,
  signal,
  Signal,
  WritableSignal
} from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SwitchComponent } from './shared/components/switch/switch.component';
import { SiteWideSearchComponent } from './shared/components/site-wide-search/site-wide-search.component';
import { environment } from '../environments/environment';
import { PopupService } from './shared/components/popup/popup.service';
import { SearchComponent } from './shared/components/search/search.component';
import { map, Subscription } from 'rxjs';
import { CookieAcceptanceComponent } from './pages/cookies/shared/cookie-acceptance-popup/cookie-acceptance.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { PlatformService } from './shared/services/platform.service';
import { SafeStorageService } from './shared/services/safe-storage.service';
import { AlertsComponent } from './shared/components/site-wide-alert/alerts.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    SwitchComponent,
    SiteWideSearchComponent,
    NgOptimizedImage,
    SearchComponent,
    CookieAcceptanceComponent,
    NgClass,
    AlertsComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnDestroy {
  /**
   * Make environment available to template.
   */
  protected readonly environment = environment;

  /**
   * Flag used to set if dark-mode is enabled or not.
   */
  protected darkModeEnabled: Signal<boolean>;

  /**
   * Flag used to tell if the mobile menu is showing or not.
   */
  protected showingMobileMenu: WritableSignal<boolean> = signal(false);

  /**
   * Current year, used for copyright year.
   */
  protected currentYear: Signal<number> = signal(new Date().getFullYear());

  /**
   * Allow dark mode switching.
   * @protected
   */
  protected enableDarkModeSwitch: WritableSignal<boolean> = signal(false);

  /**
   * Subscription used for storage changes.
   * @protected
   */
  protected storageSubscription: Subscription | undefined;

  /**
   * Constructor.
   * @param document
   * @param renderer
   * @param popupService
   * @param safeStorageService
   * @param platformService
   */
  constructor(
    @Inject(DOCUMENT) protected document: Document,
    protected renderer: Renderer2,
    protected popupService: PopupService,
    protected safeStorageService: SafeStorageService,
    protected platformService: PlatformService,
  ) {
    if (this.platformService.isClient()) {
      this.darkModeEnabled = toSignal(this.safeStorageService.observe().pipe(
        map((state) => state['st-dark-mode-enabled']),
      ), { initialValue: false });

      effect(() => {
        if (this.darkModeEnabled()) {
          this.renderer.addClass(this.document.body, 'dark-mode');
        } else {
          this.renderer.removeClass(this.document.body, 'dark-mode');
        }
      });

      this.storageSubscription = this.safeStorageService.observe().subscribe((state) => {
        const fathomTrackers = this.document.documentElement.getElementsByClassName('fathom-tracking-script');

        if (state['st-enable-tracking'] && fathomTrackers.length === 0) {
          // Add fathom Analytics
          const fathom = document.createElement('script');
          fathom.setAttribute('class', 'fathom-tracking-script');
          fathom.setAttribute('src', 'https://cdn.usefathom.com/script.js');
          fathom.setAttribute('data-spa', 'auto');
          fathom.setAttribute('data-site', environment.fathom_analytics_token);
          fathom.setAttribute('defer', 'defer');

          // Add to dom
          this.document.head.appendChild(fathom);
        } else if (!state['st-enable-tracking'] && fathomTrackers.length > 0) {
          fathomTrackers[0].remove();
        }

        this.enableDarkModeSwitch.set(this.safeStorageService.allowed());
      });
    }

    this.darkModeEnabled = toSignal(this.safeStorageService.observe().pipe(
      map((state) => state['st-dark-mode-enabled'])
    ), { initialValue: false });

    effect(() => {
      if (this.showingMobileMenu()) {
        this.document.body.style.overflow = 'hidden';
      } else {
        this.document.body.style.overflow = 'auto';
      }
    })
  }

  /**
   * @inheritDoc
   */
  ngOnDestroy() {
    this.storageSubscription?.unsubscribe();
  }

  /**
   * Called when the user clicks on the dark mode toggle, regardless if the value has changed or not.
   */
  onDarkModeSwitchClicked() {
    if (!this.enableDarkModeSwitch()) {
      alert('Please accept cookies to change dark/light mode.');
      return ;
    }

    this.safeStorageService.save('st-dark-mode-enabled', !this.darkModeEnabled());
  }

  /**
   * Toggle the mobile menu.
   */
  onToggleMobileMenu() {
    this.showingMobileMenu.set(!this.showingMobileMenu());
  }

  /**
   * Show the search popup.
   */
  onShowSearch() {
    this.popupService.create(
      SiteWideSearchComponent, null, true);
  }

  /**
   * Called when a user clicks on a link on the mobile menu. Closes the mobile menu before following link.
   */
  onMobileMenuLinkClicked() {
    this.showingMobileMenu.set(false);
  }
}
