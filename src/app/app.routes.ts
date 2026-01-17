import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./presentation/pages/login/login.page').then(m => m.LoginPage)
    },
    {
        path: 'home',
        loadComponent: () => import('./presentation/pages/home/home.page').then(m => m.HomePage)
    },
    {
        path: 'result/:id',
        loadComponent: () => import('./presentation/pages/result/result.page').then(m => m.ResultPage)
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];
