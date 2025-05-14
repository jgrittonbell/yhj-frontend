import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import {
  FormBuilder,
  FormsModule,
  FormArray,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthHeaderService } from '../auth-header.service';
import { UserProfileService } from '../services/user-profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  user: any = {}; // placeholder structure for now

  constructor(
    private authHeaderService: AuthHeaderService,
    private userProfileService: UserProfileService
  ) {}

  updateSuccess: boolean = false;
  updateError = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadUserProfile();
  }

  /**
   * Loads the current user's profile data from the backend
   */
  loadUserProfile(): void {
    const headers = this.authHeaderService.getAuthHeaders();
    this.userProfileService.getMyUserProfile(headers).subscribe({
      next: (data) => {
        console.log('User profile loaded:', data);
        this.user = data;
      },
      error: (err) => {
        console.error('Failed to load user profile:', err);
      },
    });
  }

  updateProfile(): void {
    const headers = this.authHeaderService.getAuthHeaders();
    const { first_name, last_name, email } = this.user;

    const body = { first_name, last_name, email };

    this.userProfileService.updateMyUserProfile(body, headers).subscribe({
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
