import { Routes } from '@angular/router';
import { UserComponent } from './components/user/user.component';
import { FormUserComponent } from './components/form-user/form-user.component';
import { AuthComponent } from './components/auth/auth.component';
import { authGuard } from './guards/auth.guard';
import { Forbbiden403Component } from './components/forbbiden403/forbbiden403.component';

//103 - configuracion de las rutas. este archivo aa.routes.ts se genera solo al crear el proyecto.

//se configura la ruta base y las de los componentes.

export const routes: Routes = [
    {
        path : '',
        pathMatch : 'full',
        redirectTo : '/users/page/0'
    },
    {
        path : 'users',
        component : UserComponent
    },
    {
        path : 'users/page/:page',
        component : UserComponent
    },
    {
        path : 'users/create',
        component : FormUserComponent,
        canActivate : [authGuard]
    },
    {
        path : 'users/edit/:id',
        component : FormUserComponent,
        canActivate : [authGuard]
    },
    {
        path : 'login',
        component : AuthComponent
    }, 
    {
        path : 'forbbiden',
        component : Forbbiden403Component
    }

];
