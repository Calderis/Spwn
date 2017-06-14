import { Component, OnInit, Input } from '@angular/core';

import { Project } from '../../../../class/project';
import { User } from '../../../../class/user';
import { Template } from '../../../../class/template';
import { Language } from '../../../../class/language';

import { TemplateService } from '../../../../services/template.service';
import { UserService } from '../../../../services/user.service';
import { FileService } from '../../../../services/files.service';

import * as path from 'path';
import * as fs from 'fs';
import * as unzip from 'unzip-stream';

import 'rxjs/Rx' ;

@Component({
  selector: 'templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss'],
  providers: [UserService, TemplateService, FileService]
})
export class TemplatesComponent implements OnInit {

	@Input() session: any;
	public project: Project = null;
	public templates: Array<Template> = [];
	public ownTemplates: Array<Template> = [];

	constructor(
		private fileService: FileService,
		private templateService: TemplateService,
		private userService: UserService) {
	}

	ngOnInit() {
		this.project = this.session.project;
		this.userService.getTemplates(this.session.user.id).subscribe(
            results => {
              	this.ownTemplates = results;
            },
            err => console.log(err)
            );
		this.templateService.getTemplates().subscribe(
	        results => {
	          	this.templates = results;
	        },
	        err => console.log(err)
	        );
	}

	// ————— TEMPLATES UPLOAD —————
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

	// ————— DOWNLAD TEMPLATES ——————
	// Download template
	public downloadTemplate(project: Project, template: Template): void{
		this.fileService.download('http://151.80.141.50:4040/api/templates/file/' + template.id, '/template/', (folderPath) =>{
			console.log(folderPath + template.id + '.zip');
			fs.createReadStream(folderPath + template.id + '.zip')
				.pipe(unzip.Extract({ path: folderPath }))
				.on('end', () => {})
				.on('error', e => console.log('error',e));
			setTimeout(() => {
				// Rename /template folder get after extracting to template id
				let defaultFolder = path.resolve(folderPath + '/template');
				let folderName = path.resolve(folderPath + '/' + template.id);
				// If template has already been downloaded, we delete it (the previous version)
				if (fs.existsSync(folderName)) {
					this.fileService.deleteFolderRecursive(folderName);
				}
				fs.renameSync(defaultFolder, folderName, function(err) {
				    if ( err ) console.log('ERROR: ' + err);
				});
				// Delete zip and default folder
				this.fileService.deleteFile(folderPath, template.id + '.zip');
				let infos = JSON.parse(fs.readFileSync(folderName + '/template.json', {encoding: 'utf8'}));
				let language = new Language(infos);
				language.id = template.id;
				language.template = template;
				language.dirname = folderName;
				project.addModule(language);
				document.getElementById("project").click();
			}, 1000);
		});
	}
}
