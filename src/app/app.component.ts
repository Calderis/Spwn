import { Component, OnInit } from '@angular/core';
import AppUpdater from './AppUpdater';
import { HomeComponent } from './views/home/home.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	// Set our default values
	public appUpdater;
	public notif = {update: false};

	constructor() {
		this.appUpdater = new AppUpdater();
		setTimeout(() => {
			this.notif.update = this.appUpdater.updateAvailable;
		}, 5000);
	}

	ngOnInit() {
	}

	public updateSoftware() {
		this.appUpdater.autoUpdater.downloadUpdate();
	}
}
