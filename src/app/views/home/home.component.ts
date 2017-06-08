import { Component, OnInit } from '@angular/core';

import { ProjectsComponent } from '../projects/projects.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [AuthService]
})
export class HomeComponent implements OnInit {

	public email: string = "";
	public password: string = "";

	constructor(private authService: AuthService) {
	}

	ngOnInit() {
	}

	public login(): void{
		console.log('Login', this.email, this.password);
		this.authService.login(this.email, this.password).subscribe(
            result => {
              console.log(result);
            },
            err => console.log(err)
            );
	}

}



