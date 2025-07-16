import { Routes } from '@angular/router';

export const VoteRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./vote.component').then((c) => c.VoteComponent),
        children: [
            {
                path: 'list',
                loadComponent: () =>
                    import('./vote-list/vote-list.component').then((c) => c.VoteListComponent),
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'list',
            },
        ],
    },
];
