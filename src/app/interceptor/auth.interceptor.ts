import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Skip requests to assets or external domains
    if (
      req.url.includes('/assets/') ||
      req.url.endsWith('.json') ||
      req.url.startsWith('https://')
    ) {
      return next.handle(req);
    }

    const token = localStorage.getItem('id_token');

    // Clone request to add the Authorization header
    let authReq = req;
    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Optional: handle global 401s
        if (error.status === 401) {
          console.warn('Unauthorized - forcing logout');
          this.authService.logout();
        }
        return throwError(() => error);
      })
    );
  }
}

/**
 * Provides the AuthInterceptor to Angular's dependency injection system.
 */
export const authInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true,
};
