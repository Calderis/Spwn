import { User } from './user';
import { Model } from './model';
import { Module } from './module';
import { Language } from './language';

export class Project {
	public id: string = '';
	public name: string = '';
	public image: string = '';
	public directory: string = '';
	public description: string = '';
	public models: any = {};
	public owner: User = null;
	public modules: Array<Language> = [];

	public projectDeployed: boolean = false;
	public modelsDeployed: boolean = false;
	public modulesDeployed: boolean = false;

	public port: number = 0;
	public url: string = 'http://151.80.141.50';

	constructor(name: string, project: Object = null) {
		if(project) this.toObject(project);
		else this.name = name;
	}

	// Set random port between 1024 and 49151
	public setPort(): void {
		this.port = Math.floor(Math.random() * 49151) + 1024;
	}

	// ————— VIEWS —————
	public openProject(){
		this.projectDeployed = !this.projectDeployed
	}
	public openModule(){
		this.modulesDeployed = !this.modulesDeployed;
	}
	public openModel(){
		this.modelsDeployed = !this.modelsDeployed
	}

	// ————— MODELS —————
	public addModel(name: string): Model{
		let model = new Model(name);
		this.models[model.className] = model;
		return this.models[model.className];
	}
	public deleteModel(model: Model): boolean{
		delete this.models[model.className];
		return true;
	}
	public cleanModels(): void{
		for(let m in this.models){
			let model = this.models[m];
			let length = model.params.length - 1;
			for(var i = length; i > -1; i--){
				console.log(model.params[i].name);
				if(model.params[i].name == '') {
					model.params.splice(i, 1);
					model.array.splice(i, 1);
				}
			}
		}
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
	public build(directory: any) {
		console.log('—————————————————————————————————————————————————— PROJECT BUILD', directory, this);

		this.cleanModels();
		this.directory = directory;
		for(let m in this.models){
			let model = this.models[m];
			model = model.build();
		}
		if(directory !== ''){
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

	// ————— EXPORT
	public toJson() {
		let json = {
			_id : this.id,
			name : this.name,
			image : this.image,
			port : this.port,
			directory : this.directory,
			description : this.description,
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
		this.port = json["port"];
		this.directory = json["directory"];
		this.description = json["description"];
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
