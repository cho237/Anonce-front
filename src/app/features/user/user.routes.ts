import { Routes } from '@angular/router';
import {AuthGuard} from "./auth/auth.guard";
import {unauthGuard} from "./auth/unauth.guard";

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
                canActivate: [AuthGuard],
            },
            {
                path: 'auth/signup',
                loadComponent: () =>
                    import('./auth/signup/signup.component').then((c) => c.SignupComponent),
                canActivate: [unauthGuard]
            },
            {
                path: 'auth/signin',
                loadComponent: () =>
                    import('./auth/signin/signin.component').then((c) => c.SigninComponent),
                canActivate: [unauthGuard]
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'list',
            },
        ],
    },
];
