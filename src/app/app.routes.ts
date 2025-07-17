import { Routes } from '@angular/router';
import {AuthGuard} from "./features/user/auth/auth.guard";
import {HomeComponent} from "./features/home/home.component";

export const routes: Routes = [
    {
        path: 'home',
       component: HomeComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'anonce',
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
        redirectTo: '/home',
    },
];
