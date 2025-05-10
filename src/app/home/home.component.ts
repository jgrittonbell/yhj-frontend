import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  message: string | null = null;

  ngOnInit(): void {
    const storedMessage = localStorage.getItem('auth_redirect_message');
    if (storedMessage) {
      this.message = storedMessage;
      localStorage.removeItem('auth_redirect_message');
    }
  }

  login() {
    const { domain, clientId, redirectUri, responseType, scope } =
      environment.cognito;

    const loginUrl = `https://${domain}/login?client_id=${clientId}&response_type=${responseType}&scope=${scope}&redirect_uri=${redirectUri}`;

    window.location.href = loginUrl;
  }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('expires_in');

    const { domain, clientId, redirectUri } = environment.cognito;
    const logoutUrl = `https://${domain}/logout?client_id=${clientId}&logout_uri=${redirectUri}`;
    window.location.href = logoutUrl;
  }
}
