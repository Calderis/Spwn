import { Component, OnInit } from '@angular/core';
import AppUpdater from './AppUpdater';

import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

import { User } from './class/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [AuthService, UserService]
})
export class AppComponent implements OnInit {
	// Set our default values
	public appUpdater;
	public notif = {update: false};

	public email: string = "";
	public password: string = "";

	public ownTemplates: Array<Template> = [];
	public templates: Array<Template> = [];

	public child: any;

	public session: any = {
		token:'',
		user: null,
		page:'new-project',
		project: null
	};

	constructor(
		private authService: AuthService,
		private userService: UserService) {
		this.appUpdater = new AppUpdater();
		setTimeout(() => {
			this.notif.update = this.appUpdater.updateAvailable;
		}, 5000);

		console.log('');

		let sessions = this.authService.load();
		if(sessions.length > 0) {
			this.session.user = sessions[0].user;
			this.session.token = sessions[0].token;
			this.userService.getUser(this.session.user.id).subscribe(
            result => {
              	this.session.user = result;
              	this.userService.save(result);
            },
            err => console.log(err)
            );
		}
	}

	ngOnInit() {
	}

	public updateSoftware() {
		this.appUpdater.autoUpdater.downloadUpdate();
	}
}
