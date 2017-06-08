import { Model } from './model';
import { Module } from './module';
import { ProjectService } from '../services/project.service';

export class Project {
	public name: string = "";
	public directory: string = "";
	public models: any = {};
	public arrayModels: Array<Model> = [];
	public modules: Array<Module> = [];
	private projectService = new ProjectService();

	constructor(name: string) {
		this.name = name;
	}

	// ————— MODELS —————
	public addModel(name: string): void{
		let model = new Model(name);
		this.models[model.className] = model;
	}
	public deleteModel(model: Model): boolean{
		delete this.models[model.className];
		return true;
	}

	// ————— Modules —————
	public addModule(language: Module): void{
		language.project = this;
		this.modules.push(language);
	}
	public deleteModule(module: Module): boolean{
		for(let i = 0; i < this.modules.length; i++) {
			if(this.modules[i] == module) {
				this.modules.splice(i, 1);
				return true;
			}
		}
		return false;
	}

	// ————— PROJECT COMPILING
	public build(directory: string) {
		this.directory = directory;
		for(let m in this.models){
			let model = this.models[m];
			model = model.build();
		}
		for(let i = 0; i < this.modules.length; i++) {
			this.modules[i].setOutput(this.directory);
			this.modules[i].build();
		}
		return true;
	}
	private reset(): void {
		this.models = {};
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

		// let modules: Array<any> = [];

		// try{
		// 	modules = JSON.parse(json["modules"]);
		// } catch(e){
		// 	modules = [];
		// }
		// this.modules = [];
		// for(let i = 0; i < modules.length; i++) {
		// 	this.modules.push(new Model(modules[i].name, models[i].json));
		// }
	}
}
