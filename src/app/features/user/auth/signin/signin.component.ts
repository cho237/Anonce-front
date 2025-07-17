import {Component, inject, OnDestroy, signal} from '@angular/core';
import {Subscription} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {AuthReq} from "../../user.model";
import {FormsModule} from "@angular/forms";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {NgClass} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {AuthService} from "../auth.service";

@Component({
    selector: 'app-signin',
    imports: [FormsModule, MatProgressSpinner, NgClass, MatIcon],
    templateUrl: './signin.component.html',
    styleUrl: './signin.component.scss'
})
export class SigninComponent implements OnDestroy {
    toastr = inject(ToastrService);
    subs = new Subscription();
    loading = signal(false);
    authService = inject(AuthService);
    router = inject(Router);
    visiblePass = signal(false);
    user = signal<AuthReq>({
        email: 'new@example.com',
        password: 'strongPassword123',
    });


    login() {
        this.loading.set(true);
        console.log(this.user());
        this.subs.add(
            this.authService
                .signin(this.user())
                .subscribe({
                    next: (res) => {
                        this.toastr.success('Login successful');
                        this.router.navigate(['/home']);
                        this.loading.set(false);
                    },
                    error: (error) => {
                        console.log(error);
                        this.toastr.error('Login failed');
                        this.loading.set(false);
                    },
                })
        );
    }

    viewPass() {
        this.visiblePass.set(!this.visiblePass());
    }


    ngOnDestroy() {
        this.subs.unsubscribe();
    }
}
