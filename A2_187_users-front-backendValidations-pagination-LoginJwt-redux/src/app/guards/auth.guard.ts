import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

//175
//183
export const authGuard: CanActivateFn = (route, state) => {

  const service = inject(AuthService);
  const router =  inject(Router);                                         //175 - se injecta router

  //si el usuario está autenticado , devuelve true
  if(service.authenticated()){

    //si el token expiro
    if(isTokenExpired()){
      service.logout();
      router.navigate(['/login']) ; 
      return false
    }

    //esto es para cuando el usuario quiere ingresar la url manualmente para ingresar a una pagina sin tener acceso segun rol.
    if(!service.isAdmin()) {
      router.navigate(['/forbbiden'])
      return false;
    }

    return true;
  }

  router.navigate(['/login']) ;    

  return false;

};


const isTokenExpired = () => {

  const service = inject(AuthService);
  const token = service.token;
  const payload = service.getPayload(token);
  const exp = payload.exp;                                      //se obtiene la fecha de expiracion y luego se compara
  const now = new Date().getTime() / 1000
  
  if(now > exp) {
    return true;
  }
  
  return false;
}