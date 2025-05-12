import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NutritionixSearchResponse } from '../interfaces/nutritionix.model';
import { NutritionixNutrientsResponse } from '../interfaces/nutritionix-parsed.model';
import { NutritionixFoodDetail } from '../interfaces/nutritionix-detail.model';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NutritionixService {
  private apiUrl = '/api/nutritionix/foods';
  private searchCache = new Map<string, NutritionixSearchResponse>();

  constructor(private http: HttpClient) {}

  searchAllFoods(
    query: string,
    headers: HttpHeaders
  ): Observable<NutritionixSearchResponse> {
    const normalizedQuery = query.trim().toLowerCase();

    if (this.searchCache.has(normalizedQuery)) {
      return of(this.searchCache.get(normalizedQuery)!);
    }

    return this.http
      .get<NutritionixSearchResponse>(
        `${this.apiUrl}?q=${encodeURIComponent(normalizedQuery)}`,
        { headers }
      )
      .pipe(tap((response) => this.searchCache.set(normalizedQuery, response)));
  }

  searchCommonFoods(query: string, headers: HttpHeaders): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/common?q=${encodeURIComponent(query)}`,
      { headers }
    );
  }

  searchBrandedFoods(query: string, headers: HttpHeaders): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/branded?q=${encodeURIComponent(query)}`,
      { headers }
    );
  }

  getFoodDetails(
    nixItemId: string,
    headers: HttpHeaders
  ): Observable<NutritionixFoodDetail> {
    return this.http.get<NutritionixFoodDetail>(`${this.apiUrl}/${nixItemId}`, {
      headers,
    });
  }

  parseNutrientsFromQuery(
    query: string,
    headers: HttpHeaders
  ): Observable<NutritionixNutrientsResponse> {
    const body = { query };
    return this.http.post<NutritionixNutrientsResponse>(
      `${this.apiUrl}/nutrients`,
      body,
      { headers }
    );
  }

  clearCache(): void {
    this.searchCache.clear();
  }
}
