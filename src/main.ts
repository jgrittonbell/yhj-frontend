/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { authInterceptorProvider } from './app/interceptor/auth.interceptor';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [...(appConfig.providers || []), authInterceptorProvider], // ✅ Extend providers
}).catch((err) => console.error(err));
