import { spawn } from 'child_process';

import { FileService } from '../services/files.service';
import { TerminalService } from '../services/terminal.service';

import { Template } from './template';
import { Project } from './project';
import { Language } from './language';

export class Module {
	public id: string = '';
	public name: string = '';
	public type: string = '';
	public template: Template;
	public templates: Array<any> = []; // List of templates that need to be translated

	// List of informations you want to get as infos in templates
    public informations: Object = {};

	public fileService = null;
	public dirname = '.';
	public output: string = '';

	public project: Project;
	public port: number = 3000;
	public process = [];

	public online = false;

	private terminal = new TerminalService();

	public status: any = {
        translated: false,
        installed: false,
        installedOnline: false,
        running: false,
        deployed: false,
        deployedOnline: false
    }

    // Here are commands used to manage your project
    public controls = [];
    // Here are commands used to install your project
    public installs = [];

	constructor(project: Project = null, module: Object = null) {
		if(module) this.toObject(module);
		this.project = project;
		this.fileService = new FileService();
	}

	public setOutput(dir: string = './output/'): void {
		let dirname = dir + '/' + this.name;
		this.fileService.ensureDirectoryExistence(dirname);
		this.output = this.fileService.path.resolve(dirname);
	}

	// Do all install commandes specified in the templates.
	public install(forceOnline: boolean = false): void{
		console.log('instal. online mode : ', forceOnline);
		this.nextInstall(this.installs, forceOnline);
	}

	public nextInstall(list, forceOnline:boolean, next = () => {}){
		console.log(list);
		if(list.length == 0){
			console.log('list end');
			if(forceOnline) { this.status.installedOnline = true; }
			else { this.status.installed = true; }
			next();
			return true;
		}
		this.spawnCmd(list[0].command.cmd, list[0].command.args, ()=>{
			list.shift();
			this.nextInstall(list, forceOnline);
        }, forceOnline, {});
	}

	// Upload files online
	public deploy(next = () => {}): void{
		if(this.type === 'API'){
			if(!this.status.deployedOnline){
				// Create User folder
				let args = [this.project.owner.id];
				this.terminal.newChildDistant('mkdir', args, false, { folder : '.' }, () => {
					// Create project folder
					let args = [this.project.name];
					this.terminal.newChildDistant('mkdir', args, false, { folder : this.project.owner.id }, () => {
						// Create module folder
						let args = [this.name];
						this.terminal.newChildDistant('mkdir', args, false, { folder : this.project.owner.id + '/' + this.project.name}, () => {
							this.updateFiles(next);
						});
					});
				});
			} else {
				this.updateFiles(next);
			}
		} else {
			next();
		}
	}

	// Upload files to distant server
	public updateFiles(next = () => {}): void{
		// Copy files to server
		// On docker container
		// for f in traductors/*; do docker cp $f test_sshd:/root/; done
		// On VPS
		// for f in traductors/*; do scp -r $f root@vps421133.ovh.net:/root/; done
		let script = 'for f in ' + this.output + '; do scp -r $f root@vps421133.ovh.net:/root/' +  this.project.owner.id + '/' + this.project.name + '/' + '; done';

		let instruction = 'sh';
		let args = ['-c', script]; // -c parameter to read script from string
		let child = this.terminal.newChild(instruction, args, true, null, () => {
			console.log('Files uploaded with success');
			this.status.deployedOnline = true;

			// Install
			this.install(true);

			next();
		});
	}

	public build(): void {} // See language.ts

	// Spawn command linked to project
	public spawnCmd(instruction: string = "", args: Array<string> = [], next = () => {}, forceOnline: boolean = false, control: any) {
		let cmd;
		let option;
		if(this.online || forceOnline){
			option = { folder : this.project.owner.id + '/' + this.project.name + '/' + this.name };
			cmd = this.terminal.newChildDistant(instruction, args, false, option);
		} else {
			option = { cwd: this.fileService.path.resolve(this.output) };
			cmd = spawn(instruction, args, option);
		}
		let child = {
			instruction: instruction,
			args: args,
			online: this.online,
			option: option,
			dir: this.fileService.path.resolve(this.output),
			spawn: cmd,
			running: true,
			logs: ""
		}
		if(control != undefined){
			control.child = child;
		}

		if(!this.online && !forceOnline){
			cmd.stdout.on('data', (data) => {
			  console.log(data.toString());
			  child.logs += data.toString();
			});

			cmd.stderr.on('data', (data) => {
			  console.log(`CMD STDERR: ${data}`);
			});
		} else {
			cmd.on('data', (data) => {
				console.log(data.toString());
				child.logs += data.toString();
			});
		}

		cmd.on('close', (code) => {
		  if (code !== 0) {
		    console.log(`CMD process exited with code ${code}`);
		  }
		  next();
		});
	}

	// ————— EXPORT
	public toJson(): any {
		let json = {
			_id : this.id,
			name : this.name,
			type : this.type,
			installs : this.installs,
			controls : this.controls,
			templates : this.templates,
			dirname : this.dirname,
			output : this.output,
			informations : this.informations,
			status : this.status,
			template : this.template.toJson()
		};

		return json;
	}
	public toObject(json: Object): Module {
		if(json["_id"] != undefined) this.id = json["_id"];
		if(json["id"] != undefined) this.id = json["id"];
		this.name = json["name"];
		this.type = json["type"];
		this.status = json["status"];
		this.installs = json["installs"];
		this.controls = json["controls"];
		this.templates = json["templates"];
		this.dirname = json["dirname"];
		this.output = json["output"];
		this.informations = json["informations"];
		if(this.installs === undefined) this.installs = [];
		if(this.controls === undefined) this.controls = [];
		if(this.templates === undefined) this.templates = [];
		if(this.informations === undefined) this.informations = {};
		if(this.status === undefined) this.status = {
	        translated: false,
	        installed: false,
	        installedOnline: false,
	        running: false,
	        deployed: false,
	        deployedOnline: false
	    };

		let template = new Template(json["template"]);
		this.template = template;

		return this;
	}
}

