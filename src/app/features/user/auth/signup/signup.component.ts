import {Component, inject, OnDestroy, signal} from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {Subscription} from "rxjs";
import {AuthService} from "../auth.service";
import {Router, RouterLink} from "@angular/router";
import {AuthReq} from "../../user.model";
import {FormsModule} from "@angular/forms";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatIcon} from "@angular/material/icon";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-signup',
  imports: [
    FormsModule,
    MatIcon,
    MatProgressSpinner,
    RouterLink,
    NgClass
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements  OnDestroy {
  toastr = inject(ToastrService);
  subs = new Subscription();
  loading = signal(false);
  authService = inject(AuthService);
  router = inject(Router);
  visiblePass = signal(false);
  user = signal<AuthReq>({
    email: '',
    password: '',
    name: ''
  });

  signup() {
    this.subs.add(
        this.authService
            .signup(this.user())
            .subscribe({
              next: (res) => {
                this.toastr.info('Compte créé avec succès');
                this.router.navigate(['/user/auth/signin']);
                this.loading.set(false);
              },
              error: (error) => {

                const errMsg = Array.isArray(error.error.message)
                    ? error.error.message[0]
                    : error.error.message || 'Échec de l’inscription';

                this.toastr.error(errMsg);
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
