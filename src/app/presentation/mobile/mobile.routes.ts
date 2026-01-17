import { Routes } from '@angular/router';

export const MOBILE_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
    },
    {
        path: 'home',
        loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage)
    },
    {
        path: 'result/:id',
        loadComponent: () => import('./pages/result/result.page').then(m => m.ResultPage)
    }
];
