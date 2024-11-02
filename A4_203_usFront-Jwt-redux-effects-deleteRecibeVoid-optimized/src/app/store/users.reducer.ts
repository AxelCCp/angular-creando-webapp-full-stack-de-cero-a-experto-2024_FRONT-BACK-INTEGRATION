import { createReducer, on } from "@ngrx/store";
import { User } from "../models/user";
import { addSuccess, find, findAll, findAllPageable, load, remove, removeSuccess, resetUser, setErrors, setPaginator, update, updateSuccess } from "./users.actions";


//este usersReducer se mapea en app.config.ts

//188

const users : User[] = [];
const user = new User();

export const usersReducer = createReducer(

    //estado inicial por defecto
    {
        users : users,
        paginator : {},
        user : user,
        errors : {}
    },

    on(findAll, (state, {users}) => {                       // {users}   : payload
        return {
            users : [...users],                             //se le pasa un nuevo arreglo
            paginator : state.paginator,                    //se mantiene el paginador tal cual como está en el state.
            user : state.user,
            errors : state.errors
        }
    }),


    on(findAllPageable, (state, {users, paginator}) => {                      
        return {
            users : [...users],                             //se le pasa un nuevo arreglo
            paginator : {...paginator},
            user : state.user,
            errors : state.errors
        }
    }),

    on(find, (state, {id}) => (
        {
            users : state.users,
            paginator : state.paginator,
            user : state.users.find(user => user.id == id) || new User(),
            errors : state.errors
        }
    )),

    on(setPaginator, (state, {paginator}) => (
        {
            users : state.users,
            paginator : {...paginator},
            user : state.user,
            errors : state.errors
        }
    )),
    //189
    on(addSuccess, (state, {userNew}) => (
        {
            users : [...state.users, {...userNew}],
            paginator : state.paginator,
            user : {...user},
            errors : {}
        }
    )),

    on(updateSuccess, (state, {userUpdated}) => ({
        users : state.users.map(u => (u.id == userUpdated.id) ? { ...userUpdated} : u),
        paginator : state.paginator,
        user : {...user},                               // tambn puede ser "new User" 
        errors : {}
    })),

    on(removeSuccess, (state, { id }) => ({
        users : state.users.filter(user => user.id != id),
        paginator : state.paginator,
        user : state.user,
        errors : state.errors
    })),

    on(setErrors, (state, {userForm ,errors}) => ({
        users : state.users,
        paginator : state.paginator,
        user : {...userForm},
        errors : {...errors}
    })),

    //192
    /*
    on(load, (state, {page}) => ({
        users : state.users,
        paginator : state.paginator,
        user : state.user
    })) 
    */

    //197
    on(resetUser, (state) => ({
        users : state.users,
        paginator : state.paginator,
        user : {...user},                    // con esto toma el valor de un nuevo usuario.
        errors : {}                          // {} : se resetean los mensajes de error de validacion en el formulario.
    })),

    //199
    /*on(setUserForm, (state, {user}) => ({
        users : state.users,
        paginator : state.paginator,
        user : {...user},                    // con esto , al tener payload, toma el usuario q recibe en el payload.
        errors : state.errors
    }))*/

);