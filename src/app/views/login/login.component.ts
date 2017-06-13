import { Component, OnInit, Input } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../class/user';

@Component({
  selector: 'login',
  providers: [],
  styleUrls: [ './login.component.scss' ],
  templateUrl: './login.component.html',
  providers: [AuthService, UserService]
})
export class LoginComponent implements OnInit {

  @Input() session: any;
  public emptyEmail: boolean = false;
  public badPassword: boolean = false;
  public emptyPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService) {
  }

  ngOnInit() {
  }

  public login(): void{
    this.authService.login(this.email, this.password).subscribe(
      result => {
         this.session.token = result.token;
         this.session.user = new User(result.user);
         this.userService.save(this.session.user);
      },
      err => {
        let emptyEmail = new RegExp('email" is not allowed to be empty', 'gi');
        let badEmail = new RegExp('Bad email', 'gi');
        let badPassword = new RegExp('Bad password', 'gi');
        let emptyPassword = new RegExp('password" is not allowed to be empty', 'gi');
        if(emptyEmail.test(error.message)) this.emptyEmail = true;
        else this.emptyEmail = false;

        if(badEmail.test(error.message)) this.badEmail = true;
        else this.badEmail = false;

        if(badPassword.test(error.message)) this.badPassword = true;
        else this.badPassword = false;

        if(emptyPassword.test(error.message)) this.emptyPassword = true;
        else this.emptyPassword = false;

      });
  }
}