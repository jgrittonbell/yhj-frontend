import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

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
    private http: HttpClient
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

          // Optional: Convert expires_in to absolute expiration time
          const expiresAt = Date.now() + tokens.expires_in * 1000;
          localStorage.setItem('expires_at', expiresAt.toString());

          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Token exchange failed:', err);
          this.router.navigate(['/']);
        },
      });
    });
  }
}
