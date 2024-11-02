import { createReducer, on } from "@ngrx/store";
import { User } from "../models/user";
import { add, find, findAll, remove, setPaginator, update } from "./users.actions";


//este usersReducer se mapea en app.config.ts

//188

const users : User[] = [];
const user = new User();

export const usersReducer = createReducer(
    {
        users : users,
        paginator : {},
        user : user,
    },

    on(findAll, (state, {users}) => {                       // {users}   : payload
        return {
            users : [...users],                             //se le pasa un nuevo arreglo
            paginator : state.paginator,                    //se mantiene el paginador tal cual como está en el state.
            user : state.user
        }
    }),

    on(find, (state, {id}) => (
        {
            users : state.users,
            paginator : state.paginator,
            user : state.users.find(user => user.id == id) || new User()
        }
    )),

    on(setPaginator, (state, {paginator}) => (
        {
            users : state.users,
            paginator : {...paginator},
            user : state.user
        }
    )),
    //189
    on(add, (state, {userNew}) => (
        {
            users : [...state.users, {...userNew}],
            paginator : state.paginator,
            user : state.user
        }
    )),

    on(update, (state, {userUpdated}) => ({
        users : state.users.map(u => (u.id == userUpdated.id) ? { ...userUpdated} : u),
        paginator : state.paginator,
        user : state.user
    })),

    on(remove, (state, { id }) => ({
        users : state.users.filter(user => user.id != id),
        paginator : state.paginator,
        user : state.user
    }))
);