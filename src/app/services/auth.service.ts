import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { NutritionixService } from './nutritionix.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private expirationWarningTimer?: ReturnType<typeof setTimeout>;
  private logoutTimer?: ReturnType<typeof setTimeout>;

  constructor(
    private router: Router,
    private nutritionixService: NutritionixService
  ) {}

  /**
   * Initiates the login redirect to AWS Cognito's Hosted UI.
   */
  login() {
    const { domain, clientId, redirectUri, responseType, scope } =
      environment.cognito;

    const loginUrl = `https://${domain}/login?client_id=${clientId}&response_type=${responseType}&scope=${scope}&redirect_uri=${redirectUri}`;

    window.location.href = loginUrl;
  }

  /**
   * Starts timers to warn the user before token expiration
   * and automatically log them out after expiration.
   */
  startTokenTimers(): void {
    const expiresAtStr = localStorage.getItem('expires_at');
    if (!expiresAtStr) {
      console.warn('No expiration time found. Skipping timers.');
      return;
    }

    const expiresAt = parseInt(expiresAtStr, 10); // Normal expiration
    const timeUntilExpiry = expiresAt - Date.now();
    const warningTime = timeUntilExpiry - 5 * 60 * 1000; // 5 minutes before

    console.log(
      `Token expires in ${(timeUntilExpiry / 1000).toFixed(0)} seconds`
    );

    // Set 5-minute warning timer
    if (warningTime > 0) {
      this.expirationWarningTimer = setTimeout(() => {
        alert('Your session will expire in 5 minutes.');
      }, warningTime);
    }

    // Set automatic logout timer
    this.logoutTimer = setTimeout(() => {
      alert('Your session has expired. Logging out.');
      this.logout();
    }, timeUntilExpiry);
  }

  /**
   * Clears both expiration and logout timers.
   */
  clearTimers(): void {
    clearTimeout(this.expirationWarningTimer);
    clearTimeout(this.logoutTimer);
  }

  /**
   * Logs the user out of the app. Clears tokens, local data,
   * and navigates back to home. This should be called instead of doing logout manually elsewhere.
   */
  logout(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.clearTimers();
    this.nutritionixService.clearCache();
    this.router.navigate(['/']);
  }
}
