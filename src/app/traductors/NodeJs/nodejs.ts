import { Component } from '@angular/core';
import { NodejsService } from './nodejs.service';
import { Project } from '../../models/project/project';
import { Language } from '../language';

@Component({
	providers: [NodejsService]
})

export class Nodejs extends Language {

	public name: string = 'NodeJs';
	public install: Array<any> = [{
		type: 'command',
		command: {
			cmd: 'npm',
			args: ['install']
		}
	}];
	public controls: Array<any> = [{
		name: '----- Start MongoDB -----',
		description: 'Run MongoDb in background',
		command: {
			cmd: 'mongod',
			args: []
		}
	}, {
		name: '----- Start Server -----',
		description: 'Run Server',
		command: {
			cmd: 'node',
			args: ['app.js']
		}
	}];

	constructor() {
		super();
		this.dirname = './src/app/traductors/nodeJs';
		this.readFiles();
		this.setOutput('./output/NodeJs');
	}

	public build(project: Project){
		this.compilFiles([{
			template: '§_server.js',
			type: 'unique'
		},{
			template: 'app/§_routes.js',
			type: 'unique'
		},{
			template: 'app/models/§_model.js',
			type: 'multiple'
		},{
			template: 'app/controllers/§_controller.js',
			type: 'multiple'
		}]);

		for(var i = 0; i < this.install.length; i++){
			this.execCmd(this.install[i].command.cmd, this.install[i].command.args);
		}
	}
}