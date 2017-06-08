import { Component, OnInit, Input } from '@angular/core';

import { Project } from '../../../class/project';
import { Model } from '../../../class/model';
import { Registry } from '../../../traductors/registry';

import { ModuleDetailsComponent } from '../module-details/module-details.component';

@Component({
  selector: 'project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {

	@Input() project: Project;
	public languages = new Registry();
	public show: boolean = false;

	constructor() {
	}

	ngOnInit() {
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
}

function isJSON(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
