import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

//185 - un interceptor ,  intercepta las llamadas al back y las envuelve, agregando el token en las cabeceras de las request.
//Esto hay q configurarlo en el app.config.ts
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {


  const token = inject(AuthService).token;

  if(token != undefined) {

    //se clona la request ya q esta es inmutable y se le agrega el token en la cabecera.
    const authReq = req.clone({

      headers : req.headers.set('Authorization', `Bearer ${token}`)

    });

    return next(authReq);                                               //se pasa el request clonado que continene el token.
  }

  return next(req);
};
