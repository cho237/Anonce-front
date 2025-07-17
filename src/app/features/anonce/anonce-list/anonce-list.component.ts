import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {AuthService} from "../../user/auth/auth.service";
import {User} from "../../user/user.model";
import {ToastrService} from "ngx-toastr";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-anonce-list',
    imports: [],
    templateUrl: './anonce-list.component.html',
    styleUrl: './anonce-list.component.scss'
})
export class AnonceListComponent implements OnInit, OnDestroy {
    user = signal<User | null>(null);
    loading = signal(false);
    toaster = inject(ToastrService);
    subs = new Subscription();
    authService = inject(AuthService);

    ngOnInit() {

    }


    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}
