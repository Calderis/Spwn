import { Component } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Structure } from '../structure/structure';
import { ModelService } from './model.service';

@Component({
		providers: [ModelService]
})

export class Model {

		public name: string = '';
		public className: string = '';
		public structure: Structure = null;

		constructor(name: string, json: string = '{}') {
			this.name = name.toLowerCase();
			this.className = name.charAt(0).toUpperCase() + name.slice(1);
			this.structure = new Structure(json);
		}

		public build(){
			this.structure.build();
		}
}
