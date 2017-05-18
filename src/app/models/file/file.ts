import { Component } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { FileService } from './file.service';

@Component({
	providers: [FileService]
})

export class File {

	public name: string = "";

	constructor(name: string) {
		this.name = name;
	}
}