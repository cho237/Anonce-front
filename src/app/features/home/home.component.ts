import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {User} from "../user/user.model";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {Subscription} from "rxjs";
import {AuthService} from "../user/auth/auth.service";
import {UserService} from "../user/user.service";

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  user = signal<User | null>(null);
  router = inject(Router);
  loading = signal(false);
  toaster = inject(ToastrService);
  subs = new Subscription();
  authService = inject(AuthService);
  userService = inject(UserService);

  ngOnInit() {


    this.subs.add(
        this.userService.me().subscribe(user => {
         this.user.set(user);
        })
    )
  }

  logout(): void {
    this.authService.logout().subscribe(({
      next: (res) => {
        this.router.navigate(['user/auth/signin']);
      },
      error: (error) => {
        this.toaster.error('Logout failed');
        this.loading.set(false);
      },
    }))
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
