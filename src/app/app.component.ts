import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    standalone: true,
    styleUrl: './app.component.scss'
})
export class AppComponent {
    title = 'front';
}
