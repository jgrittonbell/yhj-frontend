import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthHeaderService } from '../auth-header.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private authHeaderService: AuthHeaderService
  ) {}

  ngOnInit(): void {
    const headers = this.authHeaderService.getAuthHeaders();
    const apiUrl = environment.apiBaseUrl;

    this.http.get(`${apiUrl}/meals`, { headers }).subscribe({
      next: (meals) => {
        console.log('Meals from API:', meals);
      },
      error: (err) => {
        console.error('Failed to fetch meals:', err);
      },
    });

    this.http.get(`${apiUrl}/readings`, { headers }).subscribe({
      next: (readings) => {
        console.log('Glucose readings from API:', readings);
      },
      error: (err) => {
        console.error('Failed to fetch glucose readings:', err);
      },
    });
  }
}
