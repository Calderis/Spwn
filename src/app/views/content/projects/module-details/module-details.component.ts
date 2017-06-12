import { Component, OnInit, Input } from '@angular/core';

import { Module } from '../../../../class/module';

@Component({
  selector: 'module-details',
  templateUrl: './module-details.component.html',
  styleUrls: ['./module-details.component.scss']
})
export class ModuleDetailsComponent implements OnInit {

	@Input() module: Module;

	constructor() {
	}

	ngOnInit() {
	}

	public test(){
		console.log(this.module);
	}

	public arrayOf(array: Array<Module>){
		let keys = [];
	    for (let key in array) {
	        keys.push(array[key]);
	    }
	    return keys;
	}

	public moduleControle(control: any): void{
		this.module.spawnCmd(control.command.cmd, control.command.args);
	}
}