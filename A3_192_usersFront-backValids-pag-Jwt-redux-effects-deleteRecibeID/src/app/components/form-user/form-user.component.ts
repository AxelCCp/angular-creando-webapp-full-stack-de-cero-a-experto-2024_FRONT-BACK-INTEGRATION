import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../models/user';
import { SharingDataService } from '../../services/sharing-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Store } from '@ngrx/store';
import { add, find, resetUser, setUserForm, update } from '../../store/users.actions';

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
      private store : Store<{users : any}>
      ) {

    this.user = new User(); 

    this.store.select('users').subscribe(state => {
      this.errors = state.errors;
      this.user = {...state.user};
    })
  }

  ngOnInit(): void {
   
    this.store.dispatch(resetUser());                                               //199 - se hace refresh del formulario cada vez que se inicia el componente. 
   
    this.route.paramMap.subscribe((params => {
      
      const id : number = +(params.get('id') || '0');                                //109 - se obtiene el paramentro "id" y con el "+" se pasa a tipo number. si no viene el id, se pasa un 0 por defecto.
      
      if(id > 0) {
        
        this.store.dispatch(find({id}));  
        
      }

    }

    ));

  }


  onSubmit(userForm : NgForm) : void {

    this.store.dispatch(setUserForm({user : this.user}));    //199 - esto es para q almacene los datos del formulario en el user del state. esto es para que no se pierdan los datos si es que salta una validacion. 

    if(this.user.id > 0) {
      this.store.dispatch(update({userUpdated : this.user}));
    } else {
      this.store.dispatch(add({userNew : this.user}));
    }
    
    
  }


  onClear(userForm : NgForm) : void {
    this.store.dispatch(resetUser());
    userForm.reset();
    userForm.resetForm();
  }


}
