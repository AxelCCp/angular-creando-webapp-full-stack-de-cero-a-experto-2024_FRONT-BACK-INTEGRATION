import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import Swal from 'sweetalert2';
import { SharingDataService } from '../../services/sharing-data.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {


  user : User;

  constructor(private authservice : AuthService, private router : Router) {
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
  
        
        this.authservice.loginUser({username : this.user.username, password : this.user.password}).subscribe(
          
        { 
          next : response => {
  
            const token = response.token;

            console.log(token);
            
            const payload = this.authservice.getPayload(token);     

            console.log(payload);
  
            const user = {username : payload.sub};    //179 sub : de subject.
  
            this.authservice.token = token;
  
            this.authservice.user = {
  
              user,
              isAuth : true,
              isAdmin : payload.isAdmin
  
            };
  
            this.router.navigate(['/users']);          //se pone solo users,  ya q por defecto users va a tener la paginacion.
  
          },
  
          error : error => {
            
            if(error.status == 401) {
              console.log(error.error);
              Swal.fire('Login error', error.error.message, 'error');
            } else {
              throw error;
            }
  
          }
        }
  
        );
  

    }
  }

}
