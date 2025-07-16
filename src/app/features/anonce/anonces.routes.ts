import { Routes } from '@angular/router';

export const AnoncesRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./anonce.component').then((c) => c.AnonceComponent),
        children: [
            {
                path: 'list',
                loadComponent: () =>
                    import('./anonce-list/anonce-list.component').then((c) => c.AnonceListComponent),
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'list',
            },
        ],
    },
];
