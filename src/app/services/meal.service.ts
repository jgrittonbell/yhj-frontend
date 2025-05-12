import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MealService {
  private apiUrl = '/api/meals'; // relative path using proxy

  constructor(private http: HttpClient) {}

  saveMeal(mealData: any, headers: HttpHeaders): Observable<any> {
    return this.http.post(this.apiUrl, mealData, { headers });
  }

  getAllMeals(headers: HttpHeaders): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  updateMeal(
    mealId: number,
    mealData: any,
    headers: HttpHeaders
  ): Observable<any> {
    return this.http.put(`${this.apiUrl}/${mealId}`, mealData, { headers });
  }
}
