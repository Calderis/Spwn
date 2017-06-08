import { Model } from './model';
import { Module } from './module';
import { UserService } from '../services/user.service';

import { Project } from './project';
import { Template } from './template';

export class User {
	public firstname: string = "";
	public lastname: string = "";
	public pseudo: string = "";
	public email: string = "";
	public password: string = "";
	public image: string = "";
	public github: string = "";
	public stackoverflow: string = "";
	public linkedin: string = "";
	public level: string = "";
	public projects: Array<Project> = [];
	public favoris: Array<Template> = [];


	private projectService = new ProjectService();

	constructor(name: string) {
		this.name = name;
	}

	// ————— Save
	public save(){
		this.projectService.save(this);
	}
	// ————— EXPORT
	public toJson() {
		let json = {
			name : this.name,
			models : JSON.stringify(this.models)
			// modules : JSON.stringify(this.modules)
		};
		return json;
	}
	public toObject(json: Object) {
		this.name = json["name"];
		let models = JSON.parse(json["models"]);
		this.models = {};
		for(let model in models){
			this.models[models[model].name] = new Model(models[model].name, models[model].json);
		}
	}
}

