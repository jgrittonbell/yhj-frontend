import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NutritionixSearchResponse } from '../interfaces/nutritionix.model';
import { NutritionixNutrientsResponse } from '../interfaces/nutritionix-parsed.model';
import { NutritionixFoodDetail } from '../interfaces/nutritionix-detail.model';

@Injectable({
  providedIn: 'root',
})
export class NutritionixService {
  private apiUrl = '/api/nutritionix/foods';
  private searchCache = new Map<string, NutritionixSearchResponse>();

  constructor(private http: HttpClient) {}

  /**
   * Searches Nutritionix for all food types by query, with caching.
   *
   * @param query - The user-entered search string.
   * @returns An observable containing the search response.
   */
  searchAllFoods(query: string): Observable<NutritionixSearchResponse> {
    const normalizedQuery = query.trim().toLowerCase();

    if (this.searchCache.has(normalizedQuery)) {
      return of(this.searchCache.get(normalizedQuery)!);
    }

    return this.http
      .get<NutritionixSearchResponse>(
        `${this.apiUrl}?q=${encodeURIComponent(normalizedQuery)}`
      )
      .pipe(tap((response) => this.searchCache.set(normalizedQuery, response)));
  }

  /**
   * Searches Nutritionix for common food items by query.
   *
   * @param query - The user-entered search string.
   * @returns An observable containing common food matches.
   */
  searchCommonFoods(query: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/common?q=${encodeURIComponent(query)}`
    );
  }

  /**
   * Searches Nutritionix for branded food items by query.
   *
   * @param query - The user-entered search string.
   * @returns An observable containing branded food matches.
   */
  searchBrandedFoods(query: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/branded?q=${encodeURIComponent(query)}`
    );
  }

  /**
   * Retrieves detailed Nutritionix food data by item ID.
   *
   * @param nixItemId - The unique Nutritionix item ID.
   * @returns An observable containing food detail information.
   */
  getFoodDetails(nixItemId: string): Observable<NutritionixFoodDetail> {
    return this.http.get<NutritionixFoodDetail>(`${this.apiUrl}/${nixItemId}`);
  }

  /**
   * Parses a natural language food query to extract nutrient data.
   *
   * @param query - The natural language food string.
   * @returns An observable containing parsed nutrient data.
   */
  parseNutrientsFromQuery(
    query: string
  ): Observable<NutritionixNutrientsResponse> {
    const body = { query };
    return this.http.post<NutritionixNutrientsResponse>(
      `${this.apiUrl}/nutrients`,
      body
    );
  }

  /**
   * Clears the in-memory cache for all food searches.
   */
  clearCache(): void {
    this.searchCache.clear();
  }
}
