import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-vote',
  imports: [RouterOutlet],
  template: `
        <router-outlet></router-outlet>`,
})
export class VoteComponent {

}
