import { Component } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { StructureService } from './structure.service';

@Component({
	providers: [StructureService]
})

export class Structure {

	public json: string = "";
	public locked: boolean = false;
	public body: Object = {}; 
	public array: Array<any> = []; 


	constructor(json: string = "") {
		this.json = JSON.stringify(JSON.parse(json), undefined, 4);
	}

	public build(): string {
		// this.locked = true;
		let body = JSON.parse(this.json);
		this.body = body;
		this.array = [];
		for(let index in this.body) { 
			let obj = {
		    	name: index,
		    	type: this.body[index].charAt(0).toUpperCase() + this.body[index].slice(1),
		    	className: ""
		    }
		    if(/#/gi.test(this.body[index])) {
		    	obj.className = this.body[index].replace("#", "");
		    }
		    this.array.push(obj);
		}
		return body;
	}
}