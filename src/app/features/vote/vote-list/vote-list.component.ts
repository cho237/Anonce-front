import {Component, inject, signal} from '@angular/core';
import {AuthService} from "../../user/auth/auth.service";
import {UserRole} from "../../user/user.model";
import {VoteListAdminComponent} from "../vote-list-admin/vote-list-admin.component";
import {VoteListUserComponent} from "../vote-list-user/vote-list-user.component";

@Component({
  selector: 'app-vote-list',
  imports: [
    VoteListAdminComponent,
    VoteListUserComponent
  ],
  templateUrl: './vote-list.component.html',
})
export class VoteListComponent {

  authService = inject(AuthService);
  isAdmin = signal(false);

  constructor() {
    this.isAdmin = signal(this.authService.currentUser()?.role === UserRole.ADMIN);
  }

}
