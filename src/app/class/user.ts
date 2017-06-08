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

	constructor() {
	}

	// ————— EXPORT
	public toJson() {
		let json = {
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
		for(var i = 0; i < this.projects.length; i++){
			json.projects.push(this.projects[i].toJson());
		}
		for(var i = 0; i < this.favoris.length; i++){
			json.favoris.push(this.favoris[i].toJson());
		}

		return json;
	}
	public toObject(json: Object) {
		this.id = json["_id"];
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
		for(var i = 0; i < json["projects"].length; i++){
			let projects = new Project();
			projects.toObject(json["projects"][i]);
			this.projects.push(projects);
		}
		this.favoris = [];
		for(var i = 0; i < json["favoris"].length; i++){
			let favoris = new Template();
			favoris.toObject(json["favoris"][i]);
			this.favoris.push(favoris);
		}
	}
}
