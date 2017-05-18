import { Component } from '@angular/core';
import { Nodejs } from './NodeJs/nodejs';
import { Project } from '../models/project/project';

@Component({})

export class Traductors {

	public list: Object = {};

	constructor() {
		this.list = [new Nodejs()];
	}
}