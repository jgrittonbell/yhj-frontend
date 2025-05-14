import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private apiUrl = '/api/users/me';

  constructor(private http: HttpClient) {}

  /**
   * Retrieves the authenticated user's profile data.
   * Authorization is handled by the HTTP interceptor.
   *
   * @returns An Observable containing the user's profile.
   */
  getMyUserProfile(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  /**
   * Updates the authenticated user's profile.
   * Authorization is handled by the HTTP interceptor.
   *
   * @param body An object containing first name, last name, and email.
   * @returns An Observable indicating the success or failure of the update.
   */
  updateMyUserProfile(body: {
    first_name: string;
    last_name: string;
    email: string;
  }): Observable<any> {
    return this.http.put(this.apiUrl, body);
  }
}
