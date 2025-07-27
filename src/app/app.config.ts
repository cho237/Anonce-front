import {
  ApplicationConfig,
  provideZoneChangeDetection,
  LOCALE_ID,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { AuthInterceptor } from './features/user/auth/auth.interceptor';
import { registerLocaleData } from '@angular/common'; //
import localeFr from '@angular/common/locales/fr';

// Register French locale
registerLocaleData(localeFr);
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideToastr({
      timeOut: 2500,
    }),
    provideHttpClient(withFetch(), withInterceptors([AuthInterceptor])),
    { provide: LOCALE_ID, useValue: 'fr-FR' },
  ],
};
