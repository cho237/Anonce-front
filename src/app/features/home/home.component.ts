import { Component, inject, signal } from '@angular/core';
import { UserRole } from '../user/user.model';

import { AuthService } from '../user/auth/auth.service';
import { HomeAdminComponent } from './home-admin/home-admin.component';
import { HomeUserComponent } from './home-user/home-user.component';

@Component({
  selector: 'app-home',
  imports: [HomeAdminComponent, HomeUserComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  authService = inject(AuthService);
  isAdmin = signal(false);

  constructor() {
    this.isAdmin = signal(
      this.authService.currentUser()?.role === UserRole.ADMIN
    );
  }
}
