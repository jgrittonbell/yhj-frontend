import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  /**
   * Logs the user out of both the frontend app and AWS Cognito.
   * This function clears local/session storage and redirects
   * the user to Cognito’s logout URL.
   */
  logout(): void {
    // Remove any locally stored tokens or session data.
    // Clear the stored the Cognito ID token, access token, or user info in localStorage or sessionStorage.
    localStorage.clear();
    sessionStorage.clear();

    // Step 3: Force the browser to navigate to the logout URL
    window.location.href = '/';
  }
}
