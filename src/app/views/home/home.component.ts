import { Component, OnInit } from '@angular/core';

import { ProjectsComponent } from '../projects/projects.component';
import { AuthService } from '../../services/auth.service';
import { FileService } from '../../services/files.service';
import { UserService } from '../../services/user.service';
import { TemplateService } from '../../services/template.service';
import { TerminalService } from '../../services/terminal.service';

import { Template } from '../../class/template';

import * as fs from 'fs';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [AuthService, FileService, UserService, TemplateService, TerminalService]
})
export class HomeComponent implements OnInit {

	public email: string = "";
	public password: string = "";

	public session: any = null;
	public ownTemplates: Array<Template> = [];
	public templates: Array<Template> = [];

	public child: any;

	constructor(
		private authService: AuthService,
		private fileService: FileService,
		private templateService: TemplateService,
		private terminal: TerminalService,
		private userService: UserService) {
		let sessions = this.authService.load();
		if(sessions.length > 0) {
			this.session = sessions[0];
			this.userService.getUser(this.session.user.id).subscribe(
            result => {
              	this.session.user = result;
              	console.log(this.session);
            },
            err => console.log(err)
            );
            
		}
	}

	ngOnInit() {
	}

	//
	// Create new project
	public sendChild(event: any) {
		if (event.key === 'Enter') {
		  	this.child.write(event.target.value + '\r');
		}
		return false;
	}

	public uploadTemplate(ev: Event){
		console.log('uploadTemplate', ev);
		let filesList = [];
		let foldersList = [];
		let templatesList: Array<Template> = [];

		var files:File = ev.dataTransfer.files;
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

	public login(): void{
		this.authService.login(this.email, this.password).subscribe(
            result => {
             	this.session = result;
             	this.userService.save(this.session.user);
             	console.log(this.session);
            },
            err => console.log(err)
            );
	}
}



