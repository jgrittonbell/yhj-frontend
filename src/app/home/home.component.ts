import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserProfileService } from '../services/user-profile.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

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
    private userProfileService: UserProfileService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const storedMessage = localStorage.getItem('auth_redirect_message');

    if (storedMessage) {
      this.message = storedMessage;
      localStorage.removeItem('auth_redirect_message');
    }

    this.userProfileService.getMyUserProfile().subscribe({
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

  /**
   * Redirects user to AWS Cognito login screen.
   */
  login(): void {
    this.authService.login();
  }

  /**
   * Logs out the user using the centralized AuthService.
   */
  logout(): void {
    this.authService.logout();
  }
}
