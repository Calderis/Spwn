import { Component } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Structure } from '../structure/structure';
import { Model } from '../model/model';
import { Instruction } from '../instruction/instruction';
import { RegistryService } from './registry.service';

@Component({
		providers: [RegistryService]
	})

	export class Registry {

		public body: Object = {};
		public models: Object = {};
		public instructions: Array<Instruction> = [];

		constructor() {
		}

		private reset(): void {
			this.body = {};
			this.models = {};
			this.instructions = [];
		}

		public merge(models: Array<Model>): Registry {
			this.reset();

			for(let i = 0; i < models.length; i++) {
				this.body[models[i].name] = models[i].structure.build();
				this.models[models[i].name] = models[i].structure.build();
			}

			for(let i = 0; i < models.length; i++) {
				let model = models[i];
				let json = models[i].structure.body;
				this.instructions.push(new Instruction("New Model", model.name, json));

				for(let value in json) {
					if(/#/gi.test(json[value])) {
						let modelTarget = json[value].replace("#", "");
						this.body[model.name][value] = this.body[modelTarget];
						this.body[model.name][value] = this.body[modelTarget];

						let data = {};
						data[value] = modelTarget;
						this.instructions.push(new Instruction("New link", model.name, data));
					}
				}

			}
			return this;
		}
}
