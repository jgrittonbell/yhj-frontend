import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiTestService {
  private baseUrl = '/api';

  constructor(private http: HttpClient) {}

  getMeals(): Observable<any> {
    return this.http.get(`${this.baseUrl}/meals`);
  }

  getGlucoseReadings(): Observable<any> {
    return this.http.get(`${this.baseUrl}/glucose`);
  }
}
