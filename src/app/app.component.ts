import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ToastrService} from "ngx-toastr";
import {AuthService} from "./features/user/auth/auth.service";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    standalone: true,
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
    authService = inject(AuthService);
    ngOnInit() {
        this.authService.autoLogin(); // fetch current user if cookie exists
    }

}
