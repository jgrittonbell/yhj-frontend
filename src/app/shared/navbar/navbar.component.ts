import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NutritionixService } from '../../services/nutritionix.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  constructor(private nutritionixService: NutritionixService) {}

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
    this.nutritionixService.clearCache();

    // Step 3: Force the browser to navigate to the logout URL
    window.location.href = '/';
  }
}
