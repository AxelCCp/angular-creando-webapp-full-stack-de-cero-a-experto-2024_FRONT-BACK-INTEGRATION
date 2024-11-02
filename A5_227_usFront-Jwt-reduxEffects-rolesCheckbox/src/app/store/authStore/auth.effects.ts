import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { login, loginError, loginSuccess } from "./auth.actions";
import { catchError, exhaustMap, map, of, tap } from "rxjs";
import Swal from "sweetalert2";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthEffects {

    login$ : any;

    loginSuccess$ : any;

    loginError$ : any;

    constructor(private service : AuthService, private actions$ : Actions, private router : Router){

        this.login$ = createEffect(() => this.actions$.pipe(
            ofType(login),
            exhaustMap(action => this.service.loginUser({username : action.username, password : action.password})
            
            .pipe(
                map(response =>{
                    //se obtiene el token
                    const token = response.token;

                    console.log(token);
                    //se extrae el payload del token
                    const payload = this.service.getPayload(token);     
        
                    console.log(payload);
          
                    const user = {username : payload.sub};    //179 sub : de subject.
                    
                    //construccion de logindata
                    const loginData = {
                        user : {username : payload.sub},
                        isAuth : true,
                        isAdmin : payload.isAdmin
                      };
                    
                    //se pasa el token al token ,  para q se guarde en el sessionStorage
                    this.service.token = token;
                    //se pasa el user para q se guarde en el sessionStorage
                    this.service.user = loginData;
                    //se retorna el loginSuccess para q vaya al authreducer y modifique el nuevo estado.
                    return loginSuccess({login : loginData});
          
                }),

                //catchError((error) : aqui se dispara el error.    //loginError({error : error.error.message}) : aquí se recibe el error.   {error : error.error.message} : este es el payload, el action.
                catchError((error) => of(loginError({error : error.error.message})))
            )
            )
        ));



        this.loginSuccess$ = createEffect(() => this.actions$.pipe(
                ofType(loginSuccess),
                tap(() => {
                    this.router.navigate(['/users']);   
                })

         ) , {dispatch : false});


         this.loginError$ = createEffect(() => this.actions$.pipe(
            ofType(loginError),
            tap((action) => {           //aqui se emite la accion
                Swal.fire('Login error', action.error, 'error');                //del action se obtiene el error.
            })

     ) , {dispatch : false});

    }



    
}