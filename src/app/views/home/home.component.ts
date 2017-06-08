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

	public session: any = {}

	constructor(private authService: AuthService) {
		let sessions = this.authService.load();
		if(sessions.length > 0) this.session = sessions[0];
	}

	ngOnInit() {
	}

	public login(): void{
		this.authService.login(this.email, this.password).subscribe(
            result => {
              console.log(result);
            },
            err => console.log(err)
            );
	}

}



