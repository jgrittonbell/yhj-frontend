import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlucoseReading } from '../interfaces/glucose-reading';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlucoseService {
  private apiUrl = '/api/readings'; // Assumes proxy config is in place

  constructor(private http: HttpClient) {}

  /**
   * Fetch all glucose readings for the authenticated user.
   * Authorization handled by HTTP interceptor.
   */
  getAllReadings(): Observable<GlucoseReading[]> {
    return this.http.get<GlucoseReading[]>(this.apiUrl);
  }

  /**
   * Create a new glucose reading.
   */
  saveReading(reading: GlucoseReading): Observable<GlucoseReading> {
    return this.http.post<GlucoseReading>(this.apiUrl, reading);
  }

  /**
   * Update an existing glucose reading by ID.
   */
  updateReading(
    id: number,
    reading: GlucoseReading
  ): Observable<GlucoseReading> {
    return this.http.put<GlucoseReading>(`${this.apiUrl}/${id}`, reading);
  }

  /**
   * Delete a glucose reading by ID.
   */
  deleteReading(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
