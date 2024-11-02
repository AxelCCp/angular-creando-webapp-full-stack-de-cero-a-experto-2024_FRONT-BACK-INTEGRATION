import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { login, logout } from '../store/authStore/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url : string = 'http://localhost:8080/login';

  private _user : any;

  constructor(private http : HttpClient,
              private store : Store<{auth : any}>) { 
                this.store.select('auth').subscribe(state => {
                  this._user = state;
                })
              }


  loginUser({username, password} : any) : Observable<any> {
    return this.http.post<any>(this.url, {username, password});
  }


  set user(user : any) {
    this.store.dispatch(login({login : user}));
    sessionStorage.setItem('login', JSON.stringify(user));
  } 


  get user() {
    return this._user;
  }


  set token(token : string) {
    sessionStorage.setItem('token', token);
  }


  get token() {
    return sessionStorage.getItem('token')!;
  }


  //180
  getPayload(token : string) {

    if(token != null) {
      return JSON.parse(atob(token.split(".")[1]));         //177 - se toma el indice 1 de la lista. //atob : se decodifica en base 64.  //JSONN : se pasa a json.
    }

    return null;
  }

  //181 - this.user   : con esto se invoca al get de _user,  no a la variable _user.
  isAdmin() {
    return this.user.isAdmin;
  }


  //181
  authenticated() {
    return this.user.isAuth;
  }


  logout() {
    this.store.dispatch(logout())
    sessionStorage.removeItem('login');
    sessionStorage.removeItem('token');
  }


}
