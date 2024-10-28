import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users : User[] = [];

  private url : string = 'http://localhost:8080/api/users';

  constructor(private http : HttpClient) {}           //129 - private http : HttpClient

  findAll() : Observable<User[]> {
    //129 - se tiene q hacer un cast,  ya que el get() devuelve un "any".  esto se hace con el pipe() para modificar el flujo.
    
    /* manera 1
    return this.http.get('http://localhost:8080/api/users').pipe(
      map((data : any) => data as User[]),
    );
    */

    //manera 2
    return this.http.get<User[]>(this.url);

  } 

  //142 - Observable<any> : se pone "any" pq el back devuelve un obj paginador.
  findAllPageable(page : number) : Observable<any> {
    return this.http.get<any>(`${this.url}/page/${page}`);
  } 


  //130
  findById(id : number) : Observable<User> {
    return this.http.get<User>(`${this.url}/${id}`);
  }

  //131
  create(user : User) : Observable<User> {
    console.log('userservice create')
    return this.http.post<User>(this.url, user);
  }

  //131
  update(user : User) : Observable<User> {
    return this.http.put<User>(`${this.url}/${user.id}`, user);
  }

  remove(id : number) : Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

}
