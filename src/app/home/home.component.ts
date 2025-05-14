import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../environments/environment';
import { RouterModule } from '@angular/router';
import { AuthHeaderService } from '../auth-header.service';
import { UserProfileService } from '../services/user-profile.service';
import { Router } from '@angular/router';
import { NutritionixService } from '../services/nutritionix.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  message: string | null = null;
  isLoggedIn = false;
  isNewUser = false;
  userFirstName = '';

  constructor(
    private authHeaderService: AuthHeaderService,
    private userProfileService: UserProfileService,
    private router: Router,
    private nutritionixService: NutritionixService
  ) {}

  ngOnInit(): void {
    const storedMessage = localStorage.getItem('auth_redirect_message');
    if (storedMessage) {
      this.message = storedMessage;
      localStorage.removeItem('auth_redirect_message');
    }

    const headers = this.authHeaderService.getAuthHeaders();
    this.userProfileService.getMyUserProfile(headers).subscribe({
      next: (user) => {
        this.isLoggedIn = true;
        this.userFirstName = user.first_name;

        if (user.first_name === 'New' && user.last_name === 'User') {
          this.isNewUser = true;
          this.router.navigate(['/profile']);
        }
      },
      error: () => {
        this.isLoggedIn = false;
      },
    });
  }

  login() {
    const { domain, clientId, redirectUri, responseType, scope } =
      environment.cognito;

    const loginUrl = `https://${domain}/login?client_id=${clientId}&response_type=${responseType}&scope=${scope}&redirect_uri=${redirectUri}`;

    window.location.href = loginUrl;
  }

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
