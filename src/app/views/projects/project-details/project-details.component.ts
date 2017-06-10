import { Component, OnInit, Input } from '@angular/core';

import { Project } from '../../../class/project';
import { Model } from '../../../class/model';
import { User } from '../../../class/user';
import { Registry } from '../../../traductors/registry';

import { ModuleDetailsComponent } from '../module-details/module-details.component';
import { TemplateService } from '../../../services/template.service';
import { FileService } from '../../../services/files.service';
import { UserService } from '../../../services/user.service';
import * as fs from 'fs';

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
	public languages = new Registry();
	public show: boolean = false;

	constructor(
		private templateService: TemplateService,
		private filesService: FileService,
		private userService: UserService) {
	}

	ngOnInit() {
		console.log(this.session);
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
		console.log("ok", document.getElementById("directory"));
		document.getElementById("directory").click();
	}

	public build(ev: EventTarget){
		let eventObj: any = <MSInputMethodContext> event;
        let target: any = <HTMLInputElement> eventObj.target;
        let files: FileList = target.files;

        this.project.build(files[0].path);
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
		console.log(template);
		this.filesService.download('http://localhost:4040/api/templates/file/' + template.id, '/Users/remiwetteren/Projects/Hetic/Spwn/');
		// .subscribe(
	 //        file => {
	 //        	var reader = new FileReader();
	 //        	var blob = new Blob([file], { type: 'application/zip' });
	 //        	reader.readAsDataURL(blob);
	 //        	console.log(blob);
	 //        	var url = window.URL.createObjectURL(blob);
	 //        	console.log(url);
  // 				// window.open(url);
  // 				reader.onloadend = function (e) {
  // 					console.log(reader.result);
  // 					// var imageBuffer = new Buffer(reader.result, 'base64');
  // 					// fs.writeFile('/Users/remiwetteren/Projects/Hetic/Spwn/monZipTest.zip', imageBuffer, function(err) {
  // 					// });
  // 					window.location.href = reader.result;
		// 		        // window.open(reader.result, 'Excel', 'width=20,height=10,toolbar=0,menubar=0,scrollbars=no');
		// 		  }
	 //        },
	 //        err => console.log(err)
	 //        );
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
