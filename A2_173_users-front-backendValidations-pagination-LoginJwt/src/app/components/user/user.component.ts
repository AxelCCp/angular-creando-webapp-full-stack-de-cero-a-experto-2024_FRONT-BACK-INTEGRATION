import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../models/user';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SharingDataService } from '../../services/sharing-data.service';
import { PaginatorComponent } from '../paginator/paginator.component';

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
              private route : ActivatedRoute) {

    //este cod se comenta en la 132            
    
    if(this.router.getCurrentNavigation()?.extras.state) {
    
      this.users = this.router.getCurrentNavigation()?.extras.state!['users'];          //105 - desde el link del navbar, se pasa a este componenete, la lista de usuarios, y con este código se obtiene la lista de los usuarios.
    
      this.paginator = this.router.getCurrentNavigation()?.extras.state!['paginator'];    //145 - se obtiene la paginacion actual que se recibe desde los métodos en user-app.component.
    
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
      
      //142 - con paginacion
      this.route.paramMap.subscribe(params => {
        
        const page = +(params.get('page') || '0');
        
        this.service.findAllPageable(page).subscribe(pageable => {
          
          this.users = pageable.content as User[];          //142 - el obj que devuelve el rest tiene un atributo "content" y dentro de este está la lista de usuarios.
        
          this.paginator = pageable;                        //144 - en la variable paginator se almacena todo el obj paginador que devuelve el backend.

          this.sharingData.pageUsersEventEmitter.emit({users : this.users, paginator : this.paginator});    //143 - se emite el numero de pagina, ya q el componente user-app.component, pierde el numero de página, si no se le emite. 
        
        });        
      
        });  

    }
    
  }

  onRemoveUser(id : number) : void {
    this.sharingData.idUserEventEmitter.emit(id);
  }


  onSelectedUser(user : User) : void {
    this.router.navigate(['/users/edit', user.id]);                     //107 - se redirige al formulario y se pasa por url al usuario seleccionado para editar.
  }
 
}
