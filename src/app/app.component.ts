import { Component, OnInit } from '@angular/core';
import AppUpdater from './AppUpdater';

import { AuthService } from './services/auth.service';
import { FileService } from './services/files.service';
import { UserService } from './services/user.service';
import { TemplateService } from './services/template.service';
import { TerminalService } from './services/terminal.service';

import { Template } from './class/template';
import { User } from './class/user';

import * as fs from 'fs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [AuthService, FileService, UserService, TemplateService, TerminalService]
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
		private fileService: FileService,
		private templateService: TemplateService,
		private terminal: TerminalService,
		private userService: UserService) {
		this.appUpdater = new AppUpdater();
		setTimeout(() => {
			this.notif.update = this.appUpdater.updateAvailable;
		}, 5000);

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

	// Create new project
	public sendChild(event: any) {
		if (event.key === 'Enter') {
		  	this.child.write(event.target.value + '\r');
		}
		return false;
	}

	public uploadTemplate(ev: any){
		console.log('uploadTemplate', ev);
		let filesList = [];
		let foldersList = [];
		let templatesList: Array<Template> = [];

		var files = ev.dataTransfer.files;
	    Object.keys(files).forEach((key) => {
	      console.log(files[key]);
	      if(fs.lstatSync(files[key].path).isDirectory()) {
	      	let template = new Template();
	    	this.addArchive(template, files[key], this.session.user);

	    	templatesList.push(template);
	      }
	      else filesList.push(files[key]);
	    });
	}

	public addArchive(template: Template, folder: File, owner: User){
		if (!fs.existsSync(folder.path + '/template.json')) {
			console.log('No template.json');
			return false;
		}
		let infos = JSON.parse(fs.readFileSync(folder.path + '/template.json', {encoding: 'utf8'}))
		template.toObject({
			name : infos.name,
			description : infos.description,
			used : 0,
			owner : owner,
			stared : false,
			indexed : false,
			validated : false,
			codepath : '/'
		});
		let fileService = new FileService();
		this.templateService.createTemplate(template).subscribe(
            template => {
            	this.fileService.createArchive(template.id, {files: [], folders: [folder]}, (zipPath) => {
	            	this.templateService.uploadTemplate(template, zipPath);
            	});
            }, err => console.log(err));
	}
}
