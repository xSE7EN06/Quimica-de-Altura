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
        path: 'register',
        loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage)
    },
    {
        path: 'verify-email',
        loadComponent: () => import('./pages/verify-email/verify-email.page').then(m => m.VerifyEmailPage)
    },
    {
        path: 'forgot-password',
        loadComponent: () => import('./pages/forgot-password/forgot-password.page').then(m => m.ForgotPasswordPage)
    },
    {
        path: 'two-factor',
        loadComponent: () => import('./pages/two-factor/two-factor.page').then(m => m.TwoFactorPage)
    },
    {
        path: 'auth/callback/:provider',
        loadComponent: () => import('./pages/oauth-callback/oauth-callback.page').then(m => m.OAuthCallbackPage)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./layout/dashboard-layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
        canActivate: [authGuard],
        children: [
            {
                path: '',
                redirectTo: 'plants',
                pathMatch: 'full'
            },
            {
                path: 'analytics',
                loadComponent: () => import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage)
            },
            // DATOS CRUDOS
            {
                path: 'plants',
                loadComponent: () => import('./pages/plants/plants.page').then(m => m.PlantsPage)
            },
            {
                path: 'compounds',
                loadComponent: () => import('./pages/compounds/compounds.page').then(m => m.CompoundsPage)
            },
            {
                path: 'ethnobotanical',
                loadComponent: () => import('./pages/ethnobotanical/ethnobotanical.page').then(m => m.EthnobotanicalPage)
            },
            {
                path: 'genomic-data',
                loadComponent: () => import('./pages/genomic-data/genomic-data.page').then(m => m.GenomicDataPage)
            },
            {
                path: 'articles',
                loadComponent: () => import('./pages/articles/articles.page').then(m => m.ArticlesPage)
            },
            {
                path: 'ontology-map',
                loadComponent: () => import('./pages/ontology-map/ontology-map.page').then(m => m.OntologyMapPage)
            },
            {
                path: 'regional-availability',
                loadComponent: () => import('./pages/regional-availability/regional-availability.page').then(m => m.RegionalAvailabilityPage)
            },
            {
                path: 'drug-references',
                loadComponent: () => import('./pages/drug-references/drug-references.page').then(m => m.DrugReferencesPage)
            },
            // OPERACIONES
            {
                path: 'inference-jobs',
                loadComponent: () => import('./pages/inference-jobs/inference-jobs.page').then(m => m.InferenceJobsPage)
            },
            {
                path: 'data-pipelines',
                loadComponent: () => import('./pages/data-pipelines/data-pipelines.page').then(m => m.DataPipelinesPage)
            },
            {
                path: 'image-logs',
                loadComponent: () => import('./pages/image-logs/image-logs.page').then(m => m.ImageLogsPage)
            },
            {
                path: 'query-logs',
                loadComponent: () => import('./pages/query-logs/query-logs.page').then(m => m.QueryLogsPage)
            },
            {
                path: 'moderation',
                loadComponent: () => import('./pages/moderation/moderation.page').then(m => m.ModerationPage)
            },
            // ANÁLISIS
            {
                path: 'biodiversity',
                loadComponent: () => import('./pages/biodiversity/biodiversity.page').then(m => m.BiodiversityPage)
            },
            {
                path: 'phytochemical',
                loadComponent: () => import('./pages/phytochemical/phytochemical.page').then(m => m.PhytochemicalPage)
            },
            {
                path: 'evidence-quality',
                loadComponent: () => import('./pages/evidence-quality/evidence-quality.page').then(m => m.EvidenceQualityPage)
            },
            {
                path: 'genomic-tracker',
                loadComponent: () => import('./pages/genomic-tracker/genomic-tracker.page').then(m => m.GenomicTrackerPage)
            },
            {
                path: 'epidemiology',
                loadComponent: () => import('./pages/epidemiology/epidemiology.page').then(m => m.EpidemiologyPage)
            },
            {
                path: 'drug-analogs',
                loadComponent: () => import('./pages/drug-analogs/drug-analogs.page').then(m => m.DrugAnalogsPage)
            },
            {
                path: 'research-gaps',
                loadComponent: () => import('./pages/research-gaps/research-gaps.page').then(m => m.ResearchGapsPage)
            },
            // SISTEMA
            {
                path: 'users',
                loadComponent: () => import('./pages/users/users.page').then(m => m.UsersPage)
            },
            {
                path: 'apis',
                loadComponent: () => import('./pages/external-apis/external-apis.page').then(m => m.ExternalApisPage)
            },
            {
                path: 'model-versions',
                loadComponent: () => import('./pages/model-versions/model-versions.page').then(m => m.ModelVersionsPage)
            },
            {
                path: 'audit-log',
                loadComponent: () => import('./pages/audit-log/audit-log.page').then(m => m.AuditLogPage)
            },
            {
                path: 'settings',
                loadComponent: () => import('./pages/settings/settings.page').then(m => m.SettingsPage)
            }
        ]
    }
];
