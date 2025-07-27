import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { AuthService } from '../../../features/user/auth/auth.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [NgClass, MatButtonModule, MatMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnDestroy, OnInit {
  authService = inject(AuthService);
  subs = new Subscription();
  toaster = inject(ToastrService);
  router = inject(Router);

  loading = signal(false);
  // Access signal as computed for readonly use
  readonly user = computed(() => this.authService.currentUser());

  isLoggedIn = computed(() => !!this.user());
  initials = computed(() => this.getInitials(this.user()!.name));

  constructor() {}

  ngOnInit() {
    this.subs.add();
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: (res) => {
        this.router.navigate(['user/auth/signin']);
      },
      error: (error) => {
        this.toaster.error('Logout failed');
        this.loading.set(false);
      },
    });
  }

  getInitials(name: string): string {
    const words = name.trim().split(/\s+/);
    return words
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join('');
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
