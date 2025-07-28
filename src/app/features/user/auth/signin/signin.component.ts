import { Component, inject, OnDestroy, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { AuthReq } from '../../user.model';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signin',
  imports: [FormsModule, MatProgressSpinner, MatIcon, RouterLink],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
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
    this.subs.add(
      this.authService.signin(this.user()).subscribe({
        next: (res) => {
          this.toastr.success('Connexion réussie');
          this.router.navigate(['/home']);
          this.loading.set(false);
        },
        error: (error) => {
          const errMsg = Array.isArray(error.error.message)
            ? error.error.message[0]
            : error.error.message || 'Échec de la connexion';

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
