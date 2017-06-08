import { spawn } from 'child_process';
import { Template } from './template';
import { FileService } from '../services/files.service';
import { Project } from './project';


export class Module {
	public id: string = '';
	public name: string = '';
	public template: object;

	public fileService = null;
	public dirname = '.';
	public output: string = '';

	public project: Project;
	public port: number = 3000;
	public process: Array<any> = [];

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

	constructor(project: Project = null) {
		this.project = project;
		this.fileService = new FileService();
	}

	public setOutput(dir: string = './output/'): void {
		let dirname = dir + '/' + this.name;
		this.fileService.ensureDirectoryExistence(dirname);
		this.output = this.fileService.path.resolve(dirname);
	}

	public install(): void{
		for(var i = 0; i < this.installs.length; i++){
            this.spawnCmd(this.installs[i].command.cmd, this.installs[i].command.args);
        }
        this.status.installed = true;
	}

	public deploy(): void{
		this.status.deployed = true;
	}

	public build(): void{
	}

	public spawnCmd(instruction: string = "", args: Array<string> = []) {
		let cmd = spawn(instruction, args, { cwd : this.fileService.path.resolve(this.output) });
		let child = {
			instruction: instruction,
			args: args,
			dir: this.fileService.path.resolve(this.output),
			spawn: cmd,
			running: true,
			logs: ""
		}
		this.process.push(child);

		cmd.stdout.on('data', (data) => {
		  console.log(data.toString());
		  child.logs += data.toString();
		});

		cmd.stderr.on('data', (data) => {
		  console.log(`CMD STDERR: ${data}`);
		});

		cmd.on('close', (code) => {
		  if (code !== 0) {
		    console.log(`CMD process exited with code ${code}`);
		  }
		});
	}

	// ————— EXPORT
	public toJson() {
		let json = {
			name : this.name,
			status : this.status,
			template : this.template.toJson()
		};

		return json;
	}
	public toObject(json: Object) {
		this.id = json["_id"];
		this.name = json["name"];
		this.status = json["status"];
		
	  	let template = new Template();
	  	template.toObject(json["template"]);
		this.template = template;
	}
}

