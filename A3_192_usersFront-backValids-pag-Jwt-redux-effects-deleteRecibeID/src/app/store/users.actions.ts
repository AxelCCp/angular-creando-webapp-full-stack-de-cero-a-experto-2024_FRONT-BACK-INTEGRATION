import { createAction, props } from "@ngrx/store";
import { User } from "../models/user";


//187 - se definen las acciones.

export const findAll = createAction('findAll', props<{users : User[]}>());

export const findAllPageable = createAction('findAllPageable', props<{users : User[], paginator : any}>());

export const setPaginator = createAction('setPaginator', props<{paginator : any}>());

export const find = createAction('find', props<{id : number}>());

export const add = createAction('add', props<{userNew : User}>())

export const addSuccess = createAction('addSuccess', props<{userNew : User}>())

export const update = createAction('update', props<{userUpdated : User}>());

export const updateSuccess = createAction('updateSuccess', props<{userUpdated : User}>());

export const remove = createAction('remove', props<{id : number}>());

export const removeSuccess = createAction('removeSuccess', props<{id : number}>());

export const load = createAction('load', props<{page : number}>());                 //192 - es para poder cargar a los usuarios segun rango de pagina.

export const setErrors = createAction('setErrors', props<{errors : any}>());

export const resetUser = createAction('resetUser');

export const setUserForm = createAction('setUserForm', props<{user : User}>());
