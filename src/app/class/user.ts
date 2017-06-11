import { Project } from './project';
import { Template } from './template';


export class User {
	public id: string = '';
	public firstname: string = '';
	public lastname: string = '';
	public pseudo: string = '';
	public email: string = '';
	public password: string = '';
	public image: string = '';
	public github: string = '';
	public stackoverflow: string = '';
	public linkedin: string = '';
	public level: string = '';
	public projects: array = [];
	public favoris: array = [];

	constructor(user: Object = null) {
		if(user) this.toObject(user);
	}

	// ————— EXPORT
	public toJson(full: boolean = true) {
		let json = {
			_id : this.id,
			firstname : this.firstname,
			lastname : this.lastname,
			pseudo : this.pseudo,
			email : this.email,
			password : this.password,
			image : this.image,
			github : this.github,
			stackoverflow : this.stackoverflow,
			linkedin : this.linkedin,
			level : this.level,
			projects : [],
			favoris : []
		};
		if(full){
			for(var i = 0; i < this.projects.length; i++){
				json.projects.push(this.projects[i].toJson());
			}
			for(var i = 0; i < this.favoris.length; i++){
				json.favoris.push(this.favoris[i].toJson());
			}
		}

		return json;
	}
	public toObject(json: Object) {
		if(json["_id"] != undefined) this.id = json["_id"];
		if(json["id"] != undefined) this.id = json["id"];
		this.firstname = json["firstname"];
		this.lastname = json["lastname"];
		this.pseudo = json["pseudo"];
		this.email = json["email"];
		this.password = json["password"];
		this.image = json["image"];
		this.github = json["github"];
		this.stackoverflow = json["stackoverflow"];
		this.linkedin = json["linkedin"];
		this.level = json["level"];
		this.projects = [];
		if(json["projects"] !== undefined){
			for(var i = 0; i < json["projects"].length; i++){
				let projects = new Project('', json["projects"][i]);
				projects.owner = this;
				this.projects.push(projects);
			}
		}
		this.favoris = [];
		if(json["favoris"] !== undefined){
			for(var i = 0; i < json["favoris"].length; i++){
				let favoris = new Template(json["favoris"][i]);
				this.favoris.push(favoris);
			}
		}
	}
}
