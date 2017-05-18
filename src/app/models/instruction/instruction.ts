import { Component } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { InstructionService } from './instruction.service';

@Component({
		providers: [InstructionService]
	})

	export class Instruction {

		public name: string = '';
		public details: string = '';
		public data: Object;

		constructor(name: string, details: string, data: Object = {}) {
			this.name = name;
			this.details = details;
			this.data = data;
		}
}