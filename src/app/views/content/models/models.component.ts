import { Component, OnInit, Input } from '@angular/core';

import { Project } from '../../../class/project';
import { Model } from '../../../class/model';
import { Param } from '../../../class/param';
import { User } from '../../../class/user';

import { UserService } from '../../../services/user.service';

@Component({
  selector: 'models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.scss'],
  providers: [UserService]
})
export class ModelsComponent implements OnInit {

	@Input() session: any;
	public project: Project = null;
	public modelName: string = '';
	public types = ['String', 'Number', 'Boolean', 'Object', 'Array']
	public selectedParam: Param = null;
	public currentModelJson: string = '';
	public currentModel: Model = null;

	constructor(
		private userService: UserService) {
	}

	ngOnInit() {
		this.project = this.session.project;
		this.project.cleanModels();
		for(let model in this.project.models){
			this.addParam(this.project.models[model]);
		}
	}

	// ————— MODELS —————
	public selectedModel(model: Model): void {
		this.currentModelJson = this.prettyPrint(model);
		this.currentModel = model;
		model.paramsToArray();
	}

	public prettyPrint(model: Model, secondLvl: boolean = false): string {
	    // let value = event.srcElement.value;
	    // if (isJSON(value)) {

	    //   //the json is ok
	    //   let obj = JSON.parse(value);
	    //   let pretty = JSON.stringify(obj, undefined, 4);
	    //   event.srcElement.value = pretty;
	    // }
	    let json = {};
		if(model != undefined){
			for(var i = 0; i < model.params.length; i++){
				let param = model.params[i];
				if(param.type === 'String'){
					json[param.name] = param.classname;
				} else if(param.type === 'Boolean') {
					json[param.name] = true;
				} else if(param.type === 'Number') {
					json[param.name] = Math.floor(Math.random() * 1000);
				} else if(param.type === 'Object') {
					if(secondLvl) {
						json[param.name] = param.classname + '{}';
					} else {
						json[param.name] = JSON.parse(this.prettyPrint(this.project.models[param.classname], true));
					}
				} else if(param.type === 'Array') {
					if(secondLvl) {
						json[param.name] = [(param.classname + '{}')];
					} else {
						json[param.name] = [JSON.parse(this.prettyPrint(this.project.models[param.classname], true))];
					}
				}
			}
		}
		return JSON.stringify(json, undefined, 4);
	}

	public arrayOf(array: Array<Model>){
		let keys = [];
	    for (let key in array) {
	        keys.push(array[key]);
	    }
	    return keys;
	}

	// Create new project
	public createModel(event: any) {
		if (event.key === 'Enter') {
		  	let model = this.project.addModel(event.target.value);
		  	event.target.value = '';
		  	this.addParam(model);
		}
		return false;
	}

	// ————— PARAMS —————
	public addParam(model: Model): void{
		let param = new Param();
		model.params.push(param);

		model.paramsToArray();
	}
	public checkParam(model: Model): void{
		let emptyParam: boolean = false;
		for(var i = 0; i < model.params.length; i++){
			if(model.params[i].name == '') {
				emptyParam = true;
				break;
			}
		}
		if(!emptyParam) { this.addParam(model); }
	}
	public selectParam(param: Param): void{
		if(this.selectedParam === null) { this.selectedParam = param; }
		else { this.selectedParam = null; }
	}
	public editParamType(model: Model, param: Param, type: string, classname: string = ''){
		param.type = type;
		if(type === 'String'){
			param.type = 'String';
			param.classname = type;
		} else if(type === 'Boolean') {
			param.type = 'Boolean';
			param.classname = type;
		} else if(type === 'Number') {
			param.type = 'Number';
			param.classname = type;
		} else if(type === 'Object') {
			param.type = 'Object';
			param.classname = classname;
		} else if(type === 'Array') {
			param.type = 'Array';
			param.classname = classname;
		}

		model.paramsToArray();
		this.selectedParam = null;
	}
	public deleteParam(model: Model, index: number): void{
		model.params.splice(index, 1);
		model.array.splice(index, 1);
	}

	// ————— SAVE —————
	public checkAndSave(): void{
		this.project.cleanModels();
		this.userService.save(this.session.user);
		this.session.page = 'modules';
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
