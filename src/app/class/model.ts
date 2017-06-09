import { Param } from './param';

export class Model {
	public id: string = '';
	public name: string = '';
	public params: array = [];
	public description: string = '';

	public plurialName: string = '';
	public className: string = '';
	public plurialClassName: string = '';

	public json: string = ''; // Use for json input
	public body: Object = {};
	public array: Array<Params> = [];

	constructor(name: string = '', model: Object = null) {
		if(model) this.toObject(model);
		else this.setData(name);
	}

	private setData(name: string = ''): void{
		let value = this.normName(name);
		this.name = value.name;
		this.plurialName = value.plurialName;
		this.className = value.className;
		this.plurialClassName = value.plurialClassName;
	}

	public build(): any{
		if(this.params.length){
			this.paramsToJson();
		} else {
			if(this.json === '') this.body = {};
			else this.body = JSON.parse(this.json);
			this.params = [];
			for(let index in this.body) {
				let value = this.body[index];

				let param = new Param();
				param.name = index;

				if(value === 'string'){
					param.type = 'String';
					param.classname = value;
				} else if(value === 'boolean') {
					param.type = 'Boolean';
					param.classname = value.model;
				} else if(value === 'number') {
					param.type = 'Number';
					param.classname = value.model;
				} else if(value.length === undefined) {
					param.type = 'Object';
					param.classname = value.model;
				} else {
					param.type = 'Array';
					param.classname = value[0].model;
				}
				
			    this.params.push(param);
			}
		}

		this.paramsToArray();
		
		return this.body;
	}

	private normName(name: string): any{
		if(name === undefined) let value = '';
		else let value = name.toLowerCase();
		let Value = value.charAt(0).toUpperCase() + value.slice(1);
		return {
    		name: value,
    		plurialName: value.replace(/[y^]/g, 'ie') + 's',
    		className: Value,
    		plurialClassName: Value.replace(/[y^]/g, 'ie') + 's'
    	}
	}

	// Build params from json
	public jsonToParams(json: string): void{
		this.json = json;
		this.build();
	}

	// Build this.json from params
	public paramsToJson(): void{
		let json = {};
		for(var i = 0; i < this.params.length; i++){
			let param = this.params[i];
			if(param.type === 'String' || param.type === 'Boolean' || param.type === 'Number'){
				json[param.name] = param.type.toLowerCase();
			} else if(param.type === 'Array'){
				json[param.name] = [{model:param.classname}]
			} else if(param.type === 'Object'){
				json[param.name] = {model:param.classname}
			}
		}
		this.json = JSON.stringify(json, undefined, 4);
	}

	// Prepare data for traduction
	public paramsToArray(): void{
		this.array = [];
		for(var i = 0; i < this.params.length; i++) {
			let value = this.params[i];

			let obj = {
		    	name: value.name,
		    	type: {
		    		name: '',
		    		plurialName: '',
		    		className: '',
		    		plurialClassName: ''
		    	},
		    	class: {
		    		name: '',
		    		plurialName: '',
		    		className: '',
		    		plurialClassName: ''
		    	}
		    }

			obj.type = this.normName(value.type);
			obj.class = this.normName(value.classname);
			
		    this.array.push(obj);
		}
	}

	// ————— EXPORT
	public toJson(): any {
		let json = {
			_id : this.id,
			name : this.name,
			params : [],
			description : this.description
		};
		for(var i = 0; i < this.params.length; i++){
			json.params.push(this.params[i].toJson());
		}

		return json;
	}
	public toObject(json: Object): Model {
		if(json["_id"] != undefined) this.id = json["_id"];
		if(json["id"] != undefined) this.id = json["id"];
		this.setData(json["name"]);
		this.params = [];
		for(var i = 0; i < json["params"].length; i++){
			let params = new Param();
			params.toObject(json["params"][i]);
			this.params.push(params);
		}
		this.description = json["description"];
		this.build();
		return this;
	}
}
