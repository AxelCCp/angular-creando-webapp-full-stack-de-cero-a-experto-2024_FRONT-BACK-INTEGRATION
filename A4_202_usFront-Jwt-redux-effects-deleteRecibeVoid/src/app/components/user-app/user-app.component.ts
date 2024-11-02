import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { UserComponent } from '../user/user.component';
import { FormUserComponent } from '../form-user/form-user.component';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { SharingDataService } from '../../services/sharing-data.service';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import { state } from '@angular/animations';
import { add, find, findAll, remove, setPaginator, update } from '../../store/users.actions';

@Component({
  selector: 'user-app',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],                                         //103 - se agrega RouterOutlet.
  templateUrl: './user-app.component.html',
  styleUrl: './user-app.component.css'
})
export class UserAppComponent implements OnInit{

  constructor(private router : Router,
              private sharingData : SharingDataService,
              private authservice : AuthService) {                             //190 - se inyecta el store de los usuarios
                
              }        
  

  ngOnInit(): void {
    this.handlerLogin();                                                        //176 - se suscribe este metodo.
  }


  //176 - escuchando el _handlerLoginEventEmiter
  handlerLogin() {
    this.sharingData.handlerLoginEventEmiter.subscribe(({username, password}) => {                //{username, password}  : se desestructura.
      console.log(username + ' ' + password);
      this.authservice.loginUser({username, password}).subscribe(
        
      { 
        next : response => {

          const token = response.token;
          console.log(token);
          
          const payload = this.authservice.getPayload(token);     
          console.log(payload);

          const user = {username : payload.sub};    //179 sub : de subject.

          const login = {
            user,
            isAuth : true,
            isAdmin : payload.isAdmin
          }

          this.authservice.token = token;

          this.authservice.user = login;

          this.router.navigate(['/users/page/0']);

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

    });

  } 





  



}
