import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-user',
  imports: [RouterOutlet],
  template: `
        <router-outlet></router-outlet>`,
})
export class UserComponent {

}
