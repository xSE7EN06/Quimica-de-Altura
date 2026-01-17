import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { DeviceService } from './infrastructure/device/device.service';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => {
            const deviceService = inject(DeviceService);
            return deviceService.isMobile()
                ? import('./presentation/mobile/layout/mobile-layout.component').then(m => m.MobileLayoutComponent)
                : import('./presentation/web/layout/web-layout.component').then(m => m.WebLayoutComponent);
        },
        loadChildren: () => {
            const deviceService = inject(DeviceService);
            return deviceService.isMobile()
                ? import('./presentation/mobile/mobile.routes').then(m => m.MOBILE_ROUTES)
                : import('./presentation/web/web.routes').then(m => m.WEB_ROUTES);
        }
    }
];
