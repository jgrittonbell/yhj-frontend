import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
   */
  getAllReadings(headers: HttpHeaders): Observable<GlucoseReading[]> {
    return this.http.get<GlucoseReading[]>(this.apiUrl, { headers });
  }

  /**
   * Create a new glucose reading.
   */
  saveReading(
    reading: GlucoseReading,
    headers: HttpHeaders
  ): Observable<GlucoseReading> {
    return this.http.post<GlucoseReading>(this.apiUrl, reading, { headers });
  }

  /**
   * Update an existing glucose reading by ID.
   */
  updateReading(
    id: number,
    reading: GlucoseReading,
    headers: HttpHeaders
  ): Observable<GlucoseReading> {
    return this.http.put<GlucoseReading>(`${this.apiUrl}/${id}`, reading, {
      headers,
    });
  }

  /**
   * Delete a glucose reading by ID.
   */
  deleteReading(id: number, headers: HttpHeaders): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }
}
