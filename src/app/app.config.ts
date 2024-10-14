import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import { provideRouter } from '@angular/router';

import {ROUTES} from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {HttpClientModule} from "@angular/common/http";

export const appConfig: ApplicationConfig = {
  providers: [
      provideRouter(ROUTES),
      provideAnimationsAsync(),
      importProvidersFrom(
          HttpClientModule
      ),
  ]
};
