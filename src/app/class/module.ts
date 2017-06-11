import { spawn } from 'child_process';
import { Template } from './template';
import { FileService } from '../services/files.service';
import { TerminalService } from '../services/terminal.service';
import { Project } from './project';


export class Module {
	public id: string = '';
	public name: string = '';
	public template: Template;

	public fileService = null;
	public dirname = '.';
	public output: string = '';

	public project: Project;
	public port: number = 3000;
	public process: Array<any> = [];

	public online = false;

	private terminal = new TerminalService();

	public status: any = {
        translated: false,
        installed: false,
        running: false,
        deployed: false
    }

    // Here are commands used to manage your project
    public controls: Array<any> = [];
    // Here are commands used to install your project
    public installs: Array<any> = [];

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
	// Set online to true if you want them to be applied online
	public install(online: boolean = false): void{
		for(var i = 0; i < this.installs.length; i++){
            this.spawnCmd(this.installs[i].command.cmd, this.installs[i].command.args, ()=>{}, online);
        }
        this.status.installed = true;
	}

	// Upload files online
	public deploy(next = () => {}): void{
		if(this.type === 'API'){
			if(!this.status.deployed){
				// Create User folder
				let args = this.project.owner.id;
				this.terminal.newChildDistant('mkdir', args, false, { folder : '.' }, () => {
					// Create project folder
					let args = this.project.name;
					this.terminal.newChildDistant('mkdir', args, false, { folder : this.project.owner.id }, () => {
						// Create module folder
						let args = this.name;
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
		this.rsaQuest = this.terminal.newChild(instruction, args, true, null, () => {
			console.log('Files uploaded with success');
			this.status.deployed = true;

			// Install
			this.install(true);
		});
	}

	public build(): void {} // See language.ts

	// Spawn command linked to project
	public spawnCmd(instruction: string = "", args: Array<string> = [], next = () => {}, forceOnline: boolean = false) {
		if(this.online || forceOnline){
			let cmd = this.terminal.newChildDistant(instruction, args, false, { folder : this.project.owner.id + '/' + this.project.name + '/' + this.name });
		} else {
			let cmd = this.terminal.newChild(instruction, args, false, { cwd : this.fileService.path.resolve(this.output) });
		}
		let child = {
			instruction: instruction,
			args: args,
			dir: this.fileService.path.resolve(this.output),
			spawn: cmd,
			running: true,
			logs: ""
		}
		this.process.push(child);

		cmd.on('data', (data) => {
		  console.log(data.toString());
		  child.logs += data.toString();
		});

		cmd.on('close', (code) => {
		  if (code !== 0) {
		    console.log(`CMD process exited with code ${code}`);
		  }
		  console.log(instruction, args);
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
	public toObject(json: Object): Language {
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
	        running: false,
	        deployed: false
	    };

		let template = new Template(json["template"]);
		this.template = template;

		return this;
	}
}

