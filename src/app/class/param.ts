export class Param {
	public id: string = '';
	public name: string = '';
	public type: string = '';
	public classname: string = '';

	constructor() {
	}

	// ————— EXPORT
	public toJson() {
		let json = {
			name : this.name,
			type : this.type,
			classname : this.classname
		};

		return json;
	}
	public toObject(json: Object) {
		this.id = json["_id"];
		this.name = json["name"];
		this.type = json["type"];
		this.classname = json["classname"];
	}
}
