import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './interceptors/token.interceptor';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { UserEffects } from './store/userStore/user.effects';
import { authReducer } from './store/authStore/auth.reducer';
import { usersReducer } from './store/userStore/users.reducer';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { AuthEffects } from './store/authStore/auth.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    //129 - se provee cliente http. este se usa en el user service.
    //185 - al cliente http se le pasa un interceptor.
    provideHttpClient(withInterceptors([tokenInterceptor])),
    provideStore({
        users: usersReducer,
        auth: authReducer
    }),
    provideEffects(UserEffects, AuthEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
]
};
