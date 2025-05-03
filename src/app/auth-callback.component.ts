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

      if (code) {
        this.http.post<any>('/api/auth/token', { code }).subscribe({
          next: (tokens) => {
            console.log('Tokens received:', tokens);

            // Store tokens in localStorage
            localStorage.setItem('id_token', tokens.id_token);
            localStorage.setItem('access_token', tokens.access_token);
            localStorage.setItem('expires_in', tokens.expires_in);

            this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            console.error('Token exchange failed:', err);
            this.router.navigate(['/']);
          },
        });
      } else {
        this.router.navigate(['/']);
      }
    });
  }
}
