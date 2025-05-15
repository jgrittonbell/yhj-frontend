import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MealService {
  private apiUrl = '/api/meals'; // relative path using proxy

  constructor(private http: HttpClient) {}

  /**
   * Saves a new meal entry.
   * Authorization header is automatically added by the HTTP interceptor.
   */
  saveMeal(mealData: any): Observable<any> {
    return this.http.post(this.apiUrl, mealData);
  }

  /**
   * Fetches all meals for the authenticated user.
   */
  getAllMeals(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /**
   * Updates a specific meal by ID.
   */
  updateMeal(mealId: number, mealData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${mealId}`, mealData);
  }

  /**
   * Deletes a specific meal by ID.
   */
  deleteMeal(mealId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${mealId}`);
  }

  /**
   * Fetches meals from the last N days (default is 30).
   *
   * @param days - Number of days to look back (e.g., 30)
   * @returns Observable of recent meals
   */
  getRecentMeals(days: number = 30): Observable<any[]> {
    return this.http.get<any[]>(`/api/meals/recent?days=${days}`);
  }
}
