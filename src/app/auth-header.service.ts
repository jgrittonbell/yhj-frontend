import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

/**
 * Deprecated: Use AuthInterceptor instead of manually adding auth headers.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthHeaderService {
  getAuthHeaders(): HttpHeaders {
    console.warn(
      '[AuthHeaderService] Deprecated: This method is no longer needed. AuthInterceptor adds headers automatically.'
    );
    return new HttpHeaders(); // Empty headers — safe fallback
  }
}
