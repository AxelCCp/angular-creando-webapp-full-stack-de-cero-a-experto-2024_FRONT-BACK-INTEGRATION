import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import Swal from 'sweetalert2';
import { SharingDataService } from '../../services/sharing-data.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {


  user : User;

  constructor(private sharingData : SharingDataService) {
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
      
      this.sharingData.handlerLoginEventEmiter.emit( {username : this.user.username, password : this.user.password} )

    }
  }

}
