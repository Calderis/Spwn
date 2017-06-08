import { Component } from '@angular/core';
import { Project } from '../../class/project';
import { Language } from '../../class/language';

@Component({})

export class NodeJs extends Language {

	public name: string = 'NodeJs'; // Name of your language
	public type: string = 'API'; // Type of your language
	public _moduleName: string = 'NodeJs'; // Name of your language
	// Here are list of instructions that need to be executed after code is compiling
	public installs: Array<any> = [{
		type: 'command',
		command: {
			cmd: 'npm',
			args: ['install']
		}
	}];
	// Here are commands used to manage you project
	public controls: Array<any> = [{
		name: 'Start MongoDB',
		description: 'Run MongoDb in background',
		command: {
			cmd: 'mongod',
			args: []
		}
	}, {
		name: 'Start Server',
		description: 'Run Server',
		command: {
			cmd: 'node',
			args: ['server.js']
		}
	}];

	// List of templates that need to be translated
	public templates: Array<any> = [{
			template: '§_server.js', // Which template
			type: 'unique' // Unique or multiple. Multiple mean that each model will have it's own file
		},{
			template: 'app/§_routes.js',
			type: 'unique'
		},{
			template: 'app/models/§_model.js',
			type: 'multiple'
		},{
			template: 'app/controllers/§_controller.js',
			type: 'multiple'
	}];

	// No need to modify this
	constructor() {
		super();
		this.dirname = './src/app/traductors/' + this._moduleName;
	}
}