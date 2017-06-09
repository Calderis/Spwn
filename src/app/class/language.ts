import * as fs from 'fs';
import * as path from 'path';
import { spawn, exec } from 'child_process';

import { Project } from './project';
import { Balise } from './balise';
import { Module } from './module';
import { FileService } from '../services/files.service';

export class Language extends Module {

	public name: string = ''; // Name of your language
	public type: string = ''; // Type of your language
	public installs: Array<any> = [];
	public controls: Array<any> = [];
	public templates: Array<any> = [];

	private files: FileService = null;
	public dirname: string = '.';
    public output: string = '';
	public project: Project;

    // List of informations you want to get as infos in templates
    public informations: Object = {};

    // List of templates that need to be translated
    public templates: Array<any> = [];

	constructor() {
        super();
        this.files = new FileService();
	}

    // Function that will be called by the programm.
    public build(){
    	if(this.dirname === '.') {
    		console.log('(Language %s) No dirname specified', this.name);
    		return false;
    	}
        this.compilFiles(this.templates);
        this.install();
        this.status.translated = true;
    }

	public buildFromTemplate(dir: string, template: string, type: string = 'unique', data: any): boolean{
		// console.log('————————————————— %s ———————————————————', template);
		if(type === 'multiple') {
			for(let d in data) {
				let file = data[d].plurialName + '.' + template.split('.').pop();
				fs.writeFileSync(path.join(this.output, template.replace(/§_.+?(?=\.)/, file.replace(/\..*/, ''))), this.translateFile(path.resolve(path.join(dir, template)), data[d]));
			}
			// Delete template after traduction
			this.files.deleteFile(this.output, template);
			return true;
		}
		fs.writeFileSync(path.join(this.output, template.replace('§_', '')), this.translateFile(path.resolve(path.join(dir, template)), data));
		// Delete template after traduction
		this.files.deleteFile(this.output, template);
		return true;
	}

	public translateFile(file: string, data: any): string{
		let template = fs.readFileSync(file, {encoding: 'utf8'});
		let balise = new Balise('body', template, {
            data: data,
            infos: this.informations,
            project: this.project
        });
        // console.log(balise);
		return balise.content;
	}

	public compilFiles(f: Array<any>): void {
		// deleteDirectory(this.output);
		this.files.copyFolderRecursiveSync(this.dirname + '/template/.', this.output);
		let models: Array<Model> = [];
		for(let model in this.project.models){
			models.push(this.project.models[model]);
		}
		for(let i = 0; i < f.length; i++) {
			this.buildFromTemplate(this.dirname + '/template/', f[i].template, f[i].type, models);
		}
        this.status.compiled = true;
		console.log('Files created.');
	}

	
}