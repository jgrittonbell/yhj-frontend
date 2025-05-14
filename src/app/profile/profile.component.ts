import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserProfileService } from '../services/user-profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  user: any = {};
  updateSuccess: boolean = false;
  updateError = false;
  errorMessage = '';

  constructor(private userProfileService: UserProfileService) {}

  /**
   * Lifecycle hook that runs once when the component is initialized.
   * Loads the user's profile data.
   */
  ngOnInit(): void {
    this.loadUserProfile();
  }

  /**
   * Fetches the current user's profile from the backend and assigns it to the `user` object.
   * Errors are logged to the console.
   */
  loadUserProfile(): void {
    this.userProfileService.getMyUserProfile().subscribe({
      next: (data) => {
        console.log('User profile loaded:', data);
        this.user = data;
      },
      error: (err) => {
        console.error('Failed to load user profile:', err);
      },
    });
  }

  /**
   * Sends the updated user profile to the backend.
   * Shows a success or error message based on the result.
   */
  updateProfile(): void {
    const { first_name, last_name, email } = this.user;
    const body = { first_name, last_name, email };

    this.userProfileService.updateMyUserProfile(body).subscribe({
      next: (response) => {
        console.log('Profile updated successfully:', response);
        this.updateSuccess = true;
        this.updateError = false;

        setTimeout(() => (this.updateSuccess = false), 3000);
      },
      error: (err) => {
        console.error('Failed to update profile:', err);
        this.updateSuccess = false;
        this.updateError = true;
        this.errorMessage =
          err?.error?.message || 'Something went wrong. Please try again.';

        setTimeout(() => (this.updateError = false), 5000);
      },
    });
  }
}
