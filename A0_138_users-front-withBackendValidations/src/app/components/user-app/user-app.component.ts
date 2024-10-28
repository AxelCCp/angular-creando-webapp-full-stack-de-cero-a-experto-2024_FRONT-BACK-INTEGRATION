import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { UserComponent } from '../user/user.component';
import { FormUserComponent } from '../form-user/form-user.component';
import Swal from 'sweetalert2';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { SharingDataService } from '../../services/sharing-data.service';

@Component({
  selector: 'user-app',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],                          //103 - se agrega RouterOutlet.
  templateUrl: './user-app.component.html',
  styleUrl: './user-app.component.css'
})
export class UserAppComponent implements OnInit{

  users : User[] = [];

  constructor(private router : Router,
              private service : UserService,
              private sharingData : SharingDataService) {}
  
  ngOnInit(): void {
    this.service.findAll().subscribe(users => this.users = users);              //90-nos suscribimoos a los usuarios que vengan desde el back.
    this.addUser();                                                             //107 - nos suscribimos a este evento.
    this.removeUser();
    this.findUserById();                                                        //109 - se suscribe este metodo.
  }

  //109 y 110 - este metodo se mantiene a la escucha de que le envien un id para actualizar un usuario. y una vez que obtiene el id, obtiene al usuario y luego devuelve al usuario con un nuevo evento emmiter.
  findUserById() {
    this.sharingData.findUserByIdEventEmitter.subscribe(id => {
      const user = this.users.find(user => user.id == id);
      this.sharingData.selectUserEventEmitter.emit(user);
    })
  }


  addUser() {
    //107 - desde aquí se emite el nuevo usuario
    this.sharingData.newUserEventEmitter.subscribe(user => {

      if(user.id > 0) {

        //131 - subscribe() : se pone pq una vez que el back devuelve una respuesta, ejecuta el codigo q hay dentro del subscribe().
        this.service.update(user).subscribe(
          
          //138 - validaciones que vienen desde el back. next : cuando sale todo bn. error : cuando viene error del back.
          { 
            next : (userUpdated) => {

              this.users = this.users.map(u => (u.id == userUpdated.id) ? { ...userUpdated} : u);             //actualiza la lista de los usuarios. iterando, pregunta si los id's coinciden. si coinciden, devuelve al usuario actualizado, sino devuelve al usuario q ya estaba.

              this.router.navigate(['/users'], {state : {users : this.users}});      //132

              Swal.fire({
                title: "User updated!",
                text: "The user was save ok!",
                icon: "success"
              });

            },
        
            error : (err) => {
              
              console.log('err.error: ' + err.error);
              console.log('Status de error: ' + err.status);

              if(err.status == 400) {
                this.sharingData.errorUserFormEventEmitter.emit(err.error);
              }
             
              
            }
          }
        );

        
      } else {
        
        //131
        this.service.create(user).subscribe(
          
          {
            next : (userNew) => {

              this.users = [...this.users, {...userNew}];  
              
              this.router.navigate(['/users'], {state : {users : this.users} });               //108 - redirige a /users  //132- esto ahora se pone acá para estár dentro del contexto de subscribe(). Esto pq son llamadas asincronas al back,  por lo tanto si se pone fuera del subscribe() , se van a ejecutar en paralelo,  lo que puede hacer q redirija antes de obtener la nueva imformación.

              Swal.fire({
                title: "New user created!",
                text: "The user was save ok!",
                icon: "success"
              });

            },
        
            error : (err) => {
              
              console.log('err.error: ' + err.error);
              console.log('Status de error: ' + err.status);

              if(err.status == 400) {
                this.sharingData.errorUserFormEventEmitter.emit(err.error);
              }
            
            } 
          }
        )
        
      }

    });

  }

  removeUser() : void {

    this.sharingData.idUserEventEmitter.subscribe(id => {

      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {

        if (result.isConfirmed) {
          //133
          this.service.remove(id).subscribe(() => {

            this.users = this.users.filter(user => user.id != id);

            this.router.navigate(['/users/create'], {skipLocationChange : true}).then(() => {       //108 - esto es para regargar la lista de los usuarios. lo q hace es dirigirse a  esta ruta "/users/create" o cualquier ruta, para luego ir al listado de usuarios con la info actualizada.
              
              this.router.navigate(['/users'], {state : {users : this.users} });      //132
            })

          })
  
          Swal.fire({
            title: "Deleted!",
            text: "The user has been deleted.",
            icon: "success"
          });
        }
      });

    })
    
  }


}
