export class Param {
	public id: string = '';
	public name: string = '';
	public type: string = '';
	public classname: string = '';

	constructor(param: Object = null) {
		if(param) this.toObject(param);
	}

	// ————— EXPORT
	public toJson() {
		let json = {
			_id : this.id,
			name : this.name,
			type : this.type,
			classname : this.classname
		};

		return json;
	}
	public toObject(json: Object) {
		if(json["_id"] != undefined) this.id = json["_id"];
		if(json["id"] != undefined) this.id = json["id"];
		this.name = json["name"];
		this.type = json["type"];
		this.classname = json["classname"];
	}
}
