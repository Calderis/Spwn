import { Model } from './model';
import { Module } from './module';
import { Language } from './language';

export class Project {
	public id: string = '';
	public name: string = '';
	public image: string = '';
	public directory: string = '';
	public models: any = {};
	public modules: Array<Language> = [];

	public port: number = 0;

	constructor(name: string, project: Object = null) {
		if(project) this.toObject(project);
		else this.name = name;
	}

	// Set random port between 1024 and 49151
	public setPort(): void {
		this.port = Math.floor(Math.random() * 49151) + 1024;
		console.log(this.port);
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
	public addModule(language: Language): void{
		language.project = this;
		this.modules.push(language);
	}
	public deleteModule(module: Language): boolean{
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
		console.log('—————————————————————————————————————————————————— PROJECT BUILD', this);
		this.directory = directory;
		for(let m in this.models){
			let model = this.models[m];
			model = model.build();
		}
		if(directory){
			for(let i = 0; i < this.modules.length; i++) {
				this.modules[i].setOutput(this.directory);
				this.modules[i].build();
			}
		}
		return true;
	}
	private reset(): void {
		this.models = {};
	}

	public toObject(json: Object) {
		this.name = json["name"];
		let models = JSON.parse(json["models"]);
		this.models = {};
		for(let model in models){
			this.models[models[model].name] = new Model(models[model].name);
		}
	}

	// ————— EXPORT
	public toJson() {
		let json = {
			_id : this.id,
			name : this.name,
			image : this.image,
			directory : this.directory,
			models : [],
			modules : []
		};
		for(let model in this.models){
			json.models.push(this.models[model].toJson());
		}
		for(var i = 0; i < this.modules.length; i++){
			json.modules.push(this.modules[i].toJson());
		}

		return json;
	}
	public toObject(json: Object): Project{
		if(json["_id"] != undefined) this.id = json["_id"];
		if(json["id"] != undefined) this.id = json["id"];
		this.name = json["name"];
		this.image = json["image"];
		this.directory = json["directory"];
		this.models = [];
		for(var i = 0; i < json["models"].length; i++){
			let models = new Model('', json["models"][i]);
			this.models[models.className] = models;
		}
		this.modules = [];
		for(var i = 0; i < json["modules"].length; i++){
			let modules = new Language(json["modules"][i]);
			modules.project = this;
			this.modules.push(modules);
		}
		return this;
	}
}
