import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../models/user';
import { SharingDataService } from '../../services/sharing-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'form-user',
  standalone: true,
  imports: [FormsModule],         //92-FormsModule :para poder usar formularios.
  templateUrl: './form-user.component.html',
  styleUrl: './form-user.component.css'
})
export class FormUserComponent implements OnInit{

  user : User;
  
  errors : any = {};

  constructor(
      private route : ActivatedRoute,                                                 //109 - en esta version se usa el update por id,  entonces se usa route para obtener el parametro "id".
      private sharingData : SharingDataService,
      private userService : UserService
      ) {

    this.user = new User(); 
  }

  ngOnInit(): void {
    
    //forma 1 y forma 2, funcionan en esta version A0_129, que usa el backend.

    //forma 1 - obtiene al usuario desde la lista de usuarios q viene del back.
    this.sharingData.selectUserEventEmitter.subscribe(user => this.user = user);     //110 - [los subscribe() siempre van al principio]  se suscribe al evento para obtener al usuario.  Esta linea se pone 1ro pq primero hay q suscribirse par recibir el user y despues nos suscribimos a recibir el id por parametro y a emitir el findUserByIdEventEmitter.
    
    this.route.paramMap.subscribe((params => {
      
      const id : number = +(params.get('id') || '0');                                //109 - se obtiene el paramentro "id" y con el "+" se pasa a tipo number. si no viene el id, se pasa un 0 por defecto.
      
      if(id > 0) {
        
        ////forma 1 - se emite el id
        this.sharingData.findUserByIdEventEmitter.emit(id);                          //109 - se emite al componente principal UserAppComponent, donde el metodo findUserById,  va a estar escuchando.
        
        //forma 2 - 130 - busca al usuario directamente en el back.
        //this.userService.findById(id).subscribe(user => this.user = user);
      }
    }
    ));

    //139 - nos ponemos a la escucha de los mensajes de error q puedan llegar en user-app.component.
    this.sharingData.errorUserFormEventEmitter.subscribe(errors => this.errors = errors);

  }

  onSubmit(userForm : NgForm) : void {
    //139 - se comenta el if pq en esta version se usan las validaciones del back.
    //if(userForm.valid){
      this.sharingData.newUserEventEmitter.emit(this.user);                                     //106 - se emite a
      console.log(this.user);  
    //}
    
    //139 - ya no son necesarios
    //userForm.reset();
    //userForm.resetForm();
    
  }


  onClear(userForm : NgForm) : void {
    this.user = new User();
    userForm.reset();
    userForm.resetForm();
  }


}
