import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserService } from "../../services/user.service";
import { EMPTY, catchError, exhaustMap, map, of, tap } from "rxjs";
import { add, addSuccess, findAll, findAllPageable, load, remove, removeSuccess, setErrors, setPaginator, update, updateSuccess } from "./users.actions";
import { User } from "../../models/user";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

//el effect se registra en el app.config.ts


@Injectable()
export class UserEffects {

    loadUsers$ : any;

    addUsers$ : any;

    addSuccessUser$ : any;

    updateUsers$ : any;

    updateSuccessUser$  : any;

    removeUsers$ : any;

    removeSuccessUser$ : any;

    constructor(
        
        private actions$ : Actions,
        private service : UserService,
        private router : Router){
            
            //192
            this.loadUsers$ = createEffect(

                //gatilla un efecto secundario - accion "load" que a su vez tiene el paylaod.
                () => this.actions$.pipe(
                    ofType(load),
                    //se llama al metodo y el numero de página se obtiene del action.  Y el payload -> page
                    exhaustMap(action => this.service.findAllPageable(action.page)
                    //pipe para llamar operadores
                    .pipe(
                        // este map(),  ya contiene en su interior la info obtenida con findAllPageable.
                        map(pageable => {
                            //
                            const users = pageable.content as User[];
                            //
                            const paginator = pageable;
                            
                            //se hace un dispatch automatico del paginator.
                            //setPaginator({paginator});
                            
                            //devuelve los usuarios. carga los usuarios en el estado
                            return findAllPageable({users, paginator});
                        }),
                        catchError(error => of(error))
                    ))
                )

            );


            //194
            this.addUsers$ = createEffect(

                () => this.actions$.pipe(

                    ofType(add),

                    exhaustMap(action => this.service.create(action.userNew)
                    
                    .pipe(
                        //se emite el nuevo usuario. el addSuccess modifica el estado.
                        map(userNew => {
                            return addSuccess({userNew});
                        }),
                        
                        //si sale mal, se guardan los errores en el estado de angular.
                        catchError(error =>  {

                            if(error.status == 400) {
                                 return of(setErrors({userForm : action.userNew, errors : error.error}))
                            } 
                            return of(error);
                        })
                            
                    ))
                )
            );


            //197
            this.updateUsers$ = createEffect(

                () => this.actions$.pipe(

                    ofType(update),

                    exhaustMap(action => this.service.update(action.userUpdated)
                    
                    .pipe(
                        //se emite el usuario modificado. El updateSuccess modifica el estado.
                        map(userUpdated => {
                            return updateSuccess({userUpdated});
                        }),
                        
                        //si sale mal, se guardan los errores en el estado de angular.
                        catchError(error =>  {

                            if(error.status == 400) {
                                 return of(setErrors({userForm : action.userUpdated, errors : error.error}))
                            } 
                            return of(error);
                        })
                            
                    ))
                )
            );



            //200
            this.removeUsers$ = createEffect(

                () => this.actions$.pipe(

                    ofType(remove),

                    exhaustMap(action => this.service.remove(action.id)
                    
                    .pipe(
                        //se emite el usuario modificado. El updateSuccess modifica el estado.
                        map(id => {
                            return removeSuccess({id : action.id});
                        })
                            
                    ))
                )
            );            



            //195
            this.addSuccessUser$ = createEffect(() => this.actions$.pipe(
                
                ofType(addSuccess),
                
                //tap : ejecuta una tarea.
                tap(()=> {

                    this.router.navigate(['/users']); 

                    Swal.fire({
                      title: "New user created!",
                      text: "The user was save ok!",
                      icon: "success"
                    });
                })
            ), {dispatch : false})



            //197
            this.updateSuccessUser$ = createEffect(() => this.actions$.pipe(
                
                ofType(updateSuccess),
                
                //tap : ejecuta una tarea.
                tap(()=> {

                    this.router.navigate(['/users']); 

                    Swal.fire({
                        title: "User updated!",
                        text: "The user was save ok!",
                        icon: "success"
                      });

                })
            ), {dispatch : false})



            //200
              this.removeSuccessUser$ = createEffect(() => this.actions$.pipe(
                
                ofType(removeSuccess),
                
                //tap : ejecuta una tarea.
                tap(()=> {

                    this.router.navigate(['/users']); 

                    Swal.fire({
                        title: "Deleted!",
                        text: "The user has been deleted.",
                        icon: "success"
                      });

                })
            ), {dispatch : false})

        }









    /*
    //CODIGO PROFESOR - HAY UN ERROR CON EL PIPE() - NO LO RECONOCE. ------------------------------------------

    //192
    loadUsers$ = createEffect(

        //gatilla un efecto secundario - accion "load" que a su vez tiene el paylaod.
        () => this.actions$.pipe(
            ofType(load),
            //se llama al metodo y el numero de página se obtiene del action.  Y el payload -> page
            exhaustMap(action => this.service.findAllPageable(action.page)
            //pipe para llamar operadores
            .pipe(
                // este map(),  ya contiene en su interior la info obtenida con findAllPageable.
                map(pageable => {
                    //
                    const users = pageable.content as User[];
                    //
                    const paginator = pageable;
                    //se hace un dispatch automatico del paginator.
                    setPaginator({paginator});
                    //devuelve los usuarios. carga los usuarios en el estado
                    return findAll({users});
                }),
                catchError(() => EMPTY)
            ))
        )

    );


    //192 - actions$ - quiere decir que es un observable.
    constructor(private actions$ : Actions,
                private service : UserService){}

    //-----------------------------------------------------------------------------------------------------------            
    */

}