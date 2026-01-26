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
    },
    {
        path: 'detail-plant',
        loadComponent: () => import('./pages/detail-plant/detail-plant.page').then(m => m.DetailPlantPage)
    },
    {
        path: 'categories',
        loadComponent: () => import('./pages/categories/categories.page').then(m => m.CategoriesPage)
    },
    {
        path: 'most-searched-plants',
        loadComponent: () => import('./pages/most-searched-plants/most-searched-plants.page').then(m => m.MostSearchedPlantsPage)
    },
    {
        path: 'energizers',
        loadComponent: () => import('./pages/energizers/energizers.page').then(m => m.EnergizersPage)
    },
    {
        path: 'account',
        loadComponent: () => import('./pages/account/account.page').then(m => m.AccountPage)
    }
];
