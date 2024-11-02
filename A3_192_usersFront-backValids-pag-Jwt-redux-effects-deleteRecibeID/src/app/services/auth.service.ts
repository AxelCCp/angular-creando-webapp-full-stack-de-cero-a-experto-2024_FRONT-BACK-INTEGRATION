import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url : string = 'http://localhost:8080/login';

  private _token : string | undefined;                          //179 - la variable _token va a tener 2 tipos de datos string o undefined;  

  private _user : any = {                                       //179 - esos son los datos por defecto.
    isAuth : false,
    isAdmin : false,
    user : undefined
  }

  constructor(private http : HttpClient) { }


  loginUser({username, password} : any) : Observable<any> {
    return this.http.post<any>(this.url, {username, password});
  }


  set user(user : any) {
    this._user = user;
    sessionStorage.setItem('login', JSON.stringify(user));
  } 


  get user() {

    if(this._user.isAuth) {
    
      return this._user;                                            //180 - se devuelve el usuario authenticado.
    
    } else if (sessionStorage.getItem('login') != null) {

      this._user = JSON.parse(sessionStorage.getItem('login') || '{}');                 //180 - se reasigna el usuario. el usuario se puede perder del estado,  por ejemplo si se actualiza la pagina. por lo tanto se va a buscar a la session y si no está, se pasa un obj vacio en string.
      
      return this._user;
    }

    return this._user;
  }


  set token(token : string) {
    this._token = token;
    sessionStorage.setItem('token', token);
  }


  get token() {

    if(this._token != undefined) {
      
      return this._token;
    
    } else if (sessionStorage.getItem('token')  != null){
      
      this._token = sessionStorage.getItem('token') || '';
      
      return this._token;
    } 

    return this._token!;                                //179 - como token tipo es "string | undefined" , se pone un "!".
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

    this._token = undefined;
    
    this._user = {                                       
      isAuth : false,
      isAdmin : false,
      user : undefined
    }

    sessionStorage.removeItem('login');
    sessionStorage.removeItem('token');
  }


}
