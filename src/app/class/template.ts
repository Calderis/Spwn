import * as fs from 'fs';
import { User } from './user';
import { TemplateService } from '../services/template.service';
import { FileService } from '../services/files.service';

export class Template {
	public id: string = '';
	public name: string = '';
	public used: number = 0;
	public owner: object = null;
	public stared: boolean = false;
	public indexed: boolean = false;
	public validated: boolean = false;
	public codepath: string = '';

	constructor(template: Object = null) {
		if(template) this.toObject(template);
	}

	// ————— EXPORT
	public toJson() {
		let json = {
			_id : this.id,
			name : this.name,
			description : this.description,
			used : this.used,
			owner : this.owner.toJson(),
			stared : this.stared,
			indexed : this.indexed,
			validated : this.validated,
			codepath : this.codepath
		};

		return json;
	}
	public toObject(json: Object) {
		if(json["_id"] != undefined) this.id = json["_id"];
		if(json["id"] != undefined) this.id = json["id"];
		this.name = json["name"];
		this.description = json["description"];
		this.used = json["used"];
	  	let owner = new User();
	  	owner.toObject(json["owner"]);
		this.owner = owner;
		this.stared = json["stared"];
		this.indexed = json["indexed"];
		this.validated = json["validated"];
		this.codepath = json["codepath"];
	}
}
