import { Component } from '@angular/core';
import { Project } from '../../class/project';
import { Language } from '../../class/language';

@Component({})

export class Yarn extends Language {

	public name: string = 'Yarn'; // Name of your language
	public type: string = 'API'; // Type of your language
	public _moduleName: string = 'Yarn'; // Name of your language
	// Here are list of instructions that need to be executed after code is compiling
	public installs: Array<any> = [{
		type: 'command',
		command: {
			cmd: 'npm',
			args: ['install', '-g', 'yarn']
		}
	},{
		type: 'command',
		command: {
			cmd: 'yarn',
			args: []
		}
	},{
		type: 'command',
		command: {
			cmd: 'cp',
			args: ['.env.example', '.env']
		}
	}];
	// Here are commands used to manage you project
	public controls: Array<any> = [{
		name: 'Start Server',
		description: 'Start Server',
		command: {
			cmd: 'yarn',
			args: ['start']
		}
	},{
		name: 'Start with logs',
		description: 'Selectively set DEBUG env var to get logs',
		command: {
			cmd: 'DEBUG=express-mongoose-es6-rest-api:*',
			args: ['yarn', 'start']
		}
	},{
		name: 'Run tests',
		description: 'Run tests written in ES6',
		command: {
			cmd: 'yarn',
			args: ['test']
		}
	},
	// ————— TESTS —————
	{
		name: 'Run tests',
		description: 'Run test along with code coverage',
		command: {
			cmd: 'yarn',
			args: ['test:coverage']
		}
	},{
		name: 'Run tests',
		description: 'Run tests on file change',
		command: {
			cmd: 'yarn',
			args: ['test:watch']
		}
	},{
		name: 'Run tests',
		description: 'Run tests enforcing code coverage (configured via .istanbul.yml)',
		command: {
			cmd: 'yarn',
			args: ['test:check-coverage']
		}
	},
	// ————— LINT —————
	{
		name: 'Lint code',
		description: 'Lint code with ESLint',
		command: {
			cmd: 'yarn',
			args: ['lint']
		}
	},{
		name: 'Run lint',
		description: 'Run lint on any file change',
		command: {
			cmd: 'yarn',
			args: ['lint:watch']
		}
	},
	// ————— GULP TASKS —————
	{
		name: 'Gulp clean',
		description: 'Wipe out dist and coverage directory',
		command: {
			cmd: 'gulp',
			args: ['clean']
		}
	},{
		name: 'Gulp',
		description: 'Default task: Wipes out dist and coverage directory. Compiles using babel.',
		command: {
			cmd: 'gulp',
			args: []
		}
	},
	// ————— DEPLOYMENT —————
	{
		name: 'Build',
		description: 'compile to ES5',
		command: {
			cmd: 'yarn',
			args: ['build']
		}
	},{
		name: 'Upload to server',
		description: 'upload dist/ to your server',
		command: {
			cmd: 'scp',
			args: ['-rp', 'dist/', 'user@dest:/path']
		}
	},{
		name: 'Install prod depencies',
		description: 'install production dependencies only',
		command: {
			cmd: 'yarn',
			args: ['--production']
		}
	},{
		name: 'Activate Process Manager',
		description: 'Use any process manager to start your services',
		command: {
			cmd: 'DEBUG=express-mongoose-es6-rest-api:*',
			args: ['pm2', 'start', 'dist/index.js']
		}
	}];

	// List of templates that need to be translated
	public templates: Array<any> = [{
			template: 'server/routes/§_index.route.js', // Which template
			type: 'unique' // Unique or multiple. Multiple mean that each model will have it's own file
		},{
			template: 'config/§_param-validation.js',
			type: 'unique'
		},{
			template: 'server/routes/§_route.route.js',
			type: 'multiple'
		},{
			template: 'server/tests/§_test.test.js',
			type: 'multiple'
		},{
			template: 'server/models/§_model.model.js',
			type: 'multiple'
		},{
			template: 'server/controllers/§_controller.controller.js',
			type: 'multiple'
	}];

	// No need to modify this
	constructor() {
		super();
		this.dirname = './src/app/traductors/' + this._moduleName;
	}
}