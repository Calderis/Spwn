export class Model {
	public name: string = '';
	public plurialName: string = '';
	public className: string = '';
	public plurialClassName: string = '';

	public json: string = '';
	public body: Object = {}; 
	public array: Array<any> = [];

	constructor(name: string, json: string = '{}') {
		this.name = name.toLowerCase();
		this.plurialName = this.name.replace(/[y^]/g, 'ie') + 's';
		this.className = name.charAt(0).toUpperCase() + name.slice(1);
		this.plurialClassName = this.className.replace(/[y^]/g, 'ie') + 's';

		this.json = JSON.stringify(JSON.parse(json), undefined, 4);
	}

	public build(){
		// this.locked = true;
		let body = JSON.parse(this.json);
		this.body = body;
		this.array = [];
		for(let index in this.body) {
			let value = this.body[index];
			let obj = {
		    	name: index,
		    	type: '',
		    	className: ''
		    }

			if(typeof value === 'string'){
				obj.type = value.charAt(0).toUpperCase() + value.slice(1);
				obj.className = null;
			} else if(value.length === undefined) {
				obj.type = 'Object';
				obj.className = value.model;
			} else {
				obj.type = 'Array';
				obj.className = value[0].model;
			}
			
		    this.array.push(obj);
		}
		return body;
	}
}