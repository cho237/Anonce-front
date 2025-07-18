import {Component, inject, signal} from '@angular/core';
import {AuthService} from "../../user/auth/auth.service";
import {UserRole} from "../../user/user.model";
import {AnonceListAdminComponent} from "../anonce-list-admin/anonce-list-admin.component";
import {AnonceListUserComponent} from "../anonce-list-user/anonce-list-user.component";

@Component({
    selector: 'app-anonce-list',
    imports: [
        AnonceListAdminComponent,
        AnonceListUserComponent
    ],
    templateUrl: './anonce-list.component.html',
})
export class AnonceListComponent {

    authService = inject(AuthService);
    isAdmin = signal(false);

    constructor() {
        this.isAdmin = signal(this.authService.currentUser()?.role === UserRole.ADMIN);
    }


}
