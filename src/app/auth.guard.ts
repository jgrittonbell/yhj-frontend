import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('id_token');
    const expiresIn = localStorage.getItem('expires_in');

    if (!token || !expiresIn) {
      this.showLoginRedirectMessage();
      return false;
    }

    const now = Math.floor(Date.now() / 1000);
    const expiresAt = Number(expiresIn);

    if (isNaN(expiresAt) || expiresAt < now) {
      this.showLoginRedirectMessage();
      return false;
    }

    return true;
  }

  private showLoginRedirectMessage(): void {
    localStorage.setItem(
      'auth_redirect_message',
      'Please log in to access that page.'
    );
    this.router.navigate(['/']);
  }
}
