import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../models/user';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SharingDataService } from '../../services/sharing-data.service';
import { PaginatorComponent } from '../paginator/paginator.component';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';
import { load, remove } from '../../store/userStore/users.actions';

@Component({
  selector: 'user',
  standalone: true,
  imports: [RouterLink, PaginatorComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit{

  title : string = 'User management application with routes';

  users : User[] = [];

  paginator : any = [];

  //106 - se importa el userService pq no hay como obtener la lista de usuarios en la ruta por defecto "/".
  constructor(private router : Router,
              private service : UserService,
              private sharingData : SharingDataService,
              private route : ActivatedRoute,
              private authService : AuthService,
              private store : Store<{users : any}>) {

    //193 - se mantiene a la escucha para poblar el user y el paginator con los datos del store.
    this.store.select('users').subscribe(state => {
      this.users = state.users;
      this.paginator = state.paginator;
    });

   
  }

  //132 - cada vez q se actualice el componente - se va al back 
  ngOnInit(): void {      
      //142 - con paginacion
      this.route.paramMap.subscribe(params => {
        
        const page = +(params.get('page') || '0');
        
        //al hacer el dispatch, en user.effects.ts, se gatilla la accion ofType(load) se invoca el service y ... 
        this.store.dispatch(load({page}))

      });  

    
    
  }

  onRemoveUser(id : number) : void {
    
    
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
        this.store.dispatch(remove({id}));
      }

    });

  }


  onSelectedUser(user : User) : void {
    this.router.navigate(['/users/edit', user.id]);                     //107 - se redirige al formulario y se pasa por url al usuario seleccionado para editar.
  }


  get admin() {
    return this.authService.isAdmin();
  }
 
}
