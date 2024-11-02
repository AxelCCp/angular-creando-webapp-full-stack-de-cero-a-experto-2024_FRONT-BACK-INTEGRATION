import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './interceptors/token.interceptor';
import { provideStore } from '@ngrx/store';
import { usersReducer } from './store/users.reducer';
import { provideEffects } from '@ngrx/effects';
import { UserEffects } from './store/user.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    //129 - se provee cliente http. este se usa en el user service.
    //185 - al cliente http se le pasa un interceptor.
    provideHttpClient(withInterceptors([tokenInterceptor])),
    provideStore({
        users: usersReducer
    }),
    provideEffects(UserEffects)
]
};
