import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service'; // Adjust the path as needed

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `<p>Logging you in...</p>`,
})
export class AuthCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const code = params['code'];

      if (!code) {
        this.router.navigate(['/']);
        return;
      }

      this.http.post<any>('/api/auth/token', { code }).subscribe({
        next: (tokens) => {
          console.log('Tokens received:', tokens);

          localStorage.setItem('id_token', tokens.id_token);
          localStorage.setItem('access_token', tokens.access_token);

          // Convert expires_in to absolute timestamp and store it
          const expiresAt = Date.now() + tokens.expires_in * 1000;
          localStorage.setItem('expires_at', expiresAt.toString());

          // Start session expiration timers
          this.authService.startTokenTimers();

          // Navigate to dashboard
          this.router.navigate(['']);
        },
        error: (err) => {
          console.error('Token exchange failed:', err);
          this.router.navigate(['/']);
        },
      });
    });
  }
}
