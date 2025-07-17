import { Routes } from '@angular/router';
import {AuthGuard} from "./features/user/auth/auth.guard";

export const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('./features/anonce/anonces.routes').then((r) => r.AnoncesRoutes),
        canActivate: [AuthGuard],
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
