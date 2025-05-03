import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthHeaderService {
  getAuthHeaders(): HttpHeaders {
    const idToken = localStorage.getItem('id_token');
    return new HttpHeaders({
      Authorization: `Bearer ${idToken}`,
    });
  }
}
