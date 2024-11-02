import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import Swal from 'sweetalert2';
import { SharingDataService } from '../../services/sharing-data.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { login } from '../../store/authStore/auth.actions';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {


  user : User;

  constructor(private store : Store<{auth : any}>) {
    this.user = new User();
  }

  onSubmit() {

    console.log('onsub')

    if(!this.user.username || !this.user.password) {
      
      Swal.fire(
        'Error validation!',
        'Username and password required!',
        'error'
      )

    } else {     
  
      this.store.dispatch(login({username : this.user.username, password : this.user.password}));

    }
  }
}
