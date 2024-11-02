import { createAction, props } from "@ngrx/store";

export const login = createAction('login', props<{login : any}>());

export  const logout = createAction('logout')