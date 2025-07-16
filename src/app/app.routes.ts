import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('./features/anonce/anonces.routes').then((r) => r.AnoncesRoutes),
    },
    {
        path: 'user',
        loadChildren: () =>
            import('./features/user/user.routes').then((r) => r.UserRoutes),
    },
    {
        path: '**',
        redirectTo: '/',
    },
];
