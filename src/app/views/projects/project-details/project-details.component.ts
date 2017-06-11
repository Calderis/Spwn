import { Component, OnInit, Input } from '@angular/core';

import { Project } from '../../../class/project';
import { Model } from '../../../class/model';
import { User } from '../../../class/user';
import { Language } from '../../../class/language';

import { ModuleDetailsComponent } from '../module-details/module-details.component';
import { TemplateService } from '../../../services/template.service';
import { FileService } from '../../../services/files.service';
import { UserService } from '../../../services/user.service';

import * as path from 'path';
import * as fs from 'fs';
import * as unzip from 'unzip-stream';

import 'rxjs/Rx' ;

@Component({
  selector: 'project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
  providers: [TemplateService, UserService, FileService]
})
export class ProjectDetailsComponent implements OnInit {

	@Input() project: Project;
	@Input() session: User;
	public show: boolean = false;

	constructor(
		private templateService: TemplateService,
		private filesService: FileService,
		private userService: UserService) {
	}

	ngOnInit() {
		this.userService.getTemplates(this.session.id).subscribe(
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

	public prettyPrint(event) {
	    let value = event.srcElement.value;
	    if (isJSON(value)) {

	      //the json is ok
	      let obj = JSON.parse(value);
	      let pretty = JSON.stringify(obj, undefined, 4);
	      event.srcElement.value = pretty;

	    }
	}

	public arrayOf(array: Array<Model>){
		let keys = [];
	    for (let key in array) {
	        keys.push(array[key]);
	    }
	    return keys;
	}

	public focusDirectory(): void {
		document.getElementById("directory").click();
	}

	public build(ev: EventTarget){
		let eventObj: any = <MSInputMethodContext> event;
        let target: any = <HTMLInputElement> eventObj.target;
        let files: FileList = target.files;

        this.project.build(files[0].path);

        this.userService.save(this.session);
	}

	// Create new project
	public createModel(event: any) {
		if (event.key === 'Enter') {
		  	this.project.addModel(event.target.value);
		}
		return false;
	}

	// Download template
	public downloadTemplate(template: Template): void{
		this.filesService.download('http://localhost:4040/api/templates/file/' + template.id, '/template/', (folderPath) =>{
			fs.createReadStream(folderPath + template.id + '.zip')
				.pipe(unzip.Extract({ path: folderPath }))
				.on('end', () => {
					setTimeout(() => {
						// Rename /template folder get after extracting to template id
						let defaultFolder = path.resolve(folderPath + '/template');
						let folderName = path.resolve(folderPath + '/' + template.id);
						// If template has already been downloaded, we delete it (the previous version)
						if (fs.existsSync(folderName)) {
							this.filesService.deleteFolderRecursive(folderName);
						}
						fs.renameSync(defaultFolder, folderName, function(err) {
						    if ( err ) console.log('ERROR: ' + err);
						});
						// Delete zip and default folder
						this.filesService.deleteFile(folderPath, template.id + '.zip');
						let infos = JSON.parse(fs.readFileSync(folderName + '/template.json', {encoding: 'utf8'}));
						let language = new Language(infos);
						language.id = template.id;
						language.template = template;
						language.dirname = folderName;
						this.project.addModule(language);
					}, 1000)
				})
				.on('error', e => console.log('error',e));
		});
	}
}

function isJSON(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
