import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../environments/environment';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
}
