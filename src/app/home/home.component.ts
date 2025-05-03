import { Component } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  login() {
    const { domain, clientId, redirectUri, responseType, scope } =
      environment.cognito;

    const loginUrl = `https://${domain}/login?client_id=${clientId}&response_type=${responseType}&scope=${scope}&redirect_uri=${redirectUri}`;

    window.location.href = loginUrl;
  }
}
