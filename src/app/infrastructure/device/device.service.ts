import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private platformId = inject(PLATFORM_ID);
  
  // Signal to hold the mobile state
  private _isMobile = signal<boolean>(this.checkIsMobile());

  // Public readonly signal
  public isMobile = computed(() => this._isMobile());

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initResizeListener();
    }
  }

  private checkIsMobile(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false; // Default to web/desktop for SSR
    }

    const width = window.innerWidth;
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Check for mobile user agents
    const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    
    // Check for small screen width (standard mobile breakpoint)
    const isSmallScreen = width < 768;

    return isMobileUserAgent || isSmallScreen;
  }

  private initResizeListener() {
    window.addEventListener('resize', () => {
      const currentState = this.checkIsMobile();
      if (this._isMobile() !== currentState) {
        this._isMobile.set(currentState);
      }
    });
  }
}
