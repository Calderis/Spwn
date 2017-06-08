export class Template {
	public id: string = '';
	public name: string = '';
	public used: boolean;
	public stared: number;
	public indexed: boolean;
	public validated: boolean;
	public codepath: string = '';

	constructor() {
	}

	// ————— EXPORT
	public toJson() {
		let json = {
			name : this.name,
			used : this.used,
			stared : this.stared,
			indexed : this.indexed,
			validated : this.validated,
			codepath : this.codepath
		};

		return json;
	}
	public toObject(json: Object) {
		this.id = json["_id"];
		this.name = json["name"];
		this.used = json["used"];
		this.stared = json["stared"];
		this.indexed = json["indexed"];
		this.validated = json["validated"];
		this.codepath = json["codepath"];
	}
}
