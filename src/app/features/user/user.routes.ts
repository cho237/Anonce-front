import { Routes } from '@angular/router';

export const UserRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./user.component').then((c) => c.UserComponent),
        children: [
            {
                path: 'list',
                loadComponent: () =>
                    import('./users-list/users-list.component').then((c) => c.UsersListComponent),
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'list',
            },
        ],
    },
];
