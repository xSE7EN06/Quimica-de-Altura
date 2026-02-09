import { Routes } from '@angular/router';

export const WEB_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.page').then(m => m.WebLoginPage)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./layout/dashboard-layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
        children: [
            {
                path: '',
                redirectTo: 'analytics',
                pathMatch: 'full'
            },
            {
                path: 'analytics',
                loadComponent: () => import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage)
            },
            {
                path: 'plants',
                loadComponent: () => import('./pages/plants/plants.page').then(m => m.PlantsPage)
            },
            {
                path: 'compounds',
                loadComponent: () => import('./pages/compounds/compounds.page').then(m => m.CompoundsPage)
            },
            {
                path: 'users',
                loadComponent: () => import('./pages/users/users.page').then(m => m.UsersPage)
            },
            {
                path: 'apis',
                loadComponent: () => import('./pages/external-apis/external-apis.page').then(m => m.ExternalApisPage)
            },
            {
                path: 'articles',
                loadComponent: () => import('./pages/articles/articles.page').then(m => m.ArticlesPage)
            }
        ]
    }
];
