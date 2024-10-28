import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../models/user';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SharingDataService } from '../../services/sharing-data.service';

@Component({
  selector: 'user',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit{

  title : string = 'User management application with routes';

  users : User[] = [];

  //106 - se importa el userService pq no hay como obtener la lista de usuarios en la ruta por defecto "/".
  constructor(private router : Router,
              private userService : UserService,
              private sharingData : SharingDataService) {

    //este cod se comenta en la 132            
    
    if(this.router.getCurrentNavigation()?.extras.state) {
      this.users = this.router.getCurrentNavigation()?.extras.state!['users'];          //105 - desde el link del navbar, se pasa a este componenete, la lista de usuarios, y con este código se obtiene la lista de los usuarios.
    } 
    
    /*
    else {
      this.userService.findAll().subscribe(users => this.users = users);                //106 - si no viene la lista de usuarios desde el estado,  se suscribe al service.
    }
    */
   
  }

  //132 - cada vez q se actualice el componente - se va al back 
  ngOnInit(): void {
    if(this.users == undefined || this.users == null || this.users.length == 0 ) {
      console.log('consulta findAll')
      this.userService.findAll().subscribe(users => this.users = users);
    }
    
  }

  onRemoveUser(id : number) : void {
    this.sharingData.idUserEventEmitter.emit(id);
  }


  onSelectedUser(user : User) : void {
    this.router.navigate(['/users/edit', user.id]);                     //107 - se redirige al formulario y se pasa por url al usuario seleccionado para editar.
  }
 
}
