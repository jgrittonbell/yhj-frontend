import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private apiUrl = '/api/users/me';

  constructor(private http: HttpClient) {}

  getMyUserProfile(headers: HttpHeaders): Observable<any> {
    return this.http.get<any>(this.apiUrl, { headers });
  }

  updateMyUserProfile(
    body: { first_name: string; last_name: string; email: string },
    headers: HttpHeaders
  ): Observable<any> {
    return this.http.put(this.apiUrl, body, { headers });
  }
}
