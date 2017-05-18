import { Component } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { File } from '../file/file';
import { Model } from '../model/model';
import { Registry } from '../registry/registry';
import { Traductors } from '../../traductors/traductors';

import { ProjectService } from './project.service';

@Component({
		providers: [ProjectService]
	})

	export class Project {

		public name: string = "";
		public models: Array<Model> = [];
		public registry: Registry = null;
		public traductors: Array<any> = [];

		constructor(private projectService: ProjectService, name: string) {
			this.name = name;
			this.registry = new Registry();
		}

		public createModel(event: any) {
			if(event.key == "Enter") {
				// Create model
				let model = new Model(event.srcElement.value);
				this.models.push(model);
				// Reset input value
				event.srcElement.value = "";

				return model;
			}
			return false;
		}
		public deleteModel(model: Model) {
			for(let i = 0; i < this.models.length; i++) {
				if(this.models[i] == model) {
					this.models.splice(i, 1);
					return true;
				}
			}
			return false;
		}

		public addTraductor(traductor: any) {
			traductor.project = this;
			this.traductors.push(traductor);
		}

		public build() {
			this.registry.merge(this.models);
			this.save();
			for(let i = 0; i < this.traductors.length; i++) {
				this.traductors[i].build(this);
			}
			return true;
		}

		public save() {
			this.projectService.save(this);
		}
		public load() {
			this.projectService.save(this);
		}

		public toJson() {
			let json = {
				name : this.name,
				models : JSON.stringify(this.models)
			};
			return json;
		}

		public toObject(json: Object) {
			this.name = json["name"];
			let models = JSON.parse(json["models"]);
			this.models = [];
			for(let i = 0; i < models.length; i++) {
				this.models.push(new Model(models[i].name, models[i].structure.json));
			}
			this.build();
		}
}