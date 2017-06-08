import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

import { Project } from '../class/project';

@Injectable()
export class ProjectService {

	private index: Object = {};
	private storageService: StorageService = new StorageService();

	constructor () {
		this.index = this.storageService.get('projects_index');
		if(this.index == null) this.index = {};
	}

	public save(project: Project): void {
		let standarName = project.name.replace(/\s/g, '_');
		this.storageService.set('project_' + standarName, project.toJson());
		this.index[standarName] = true;
		this.storageService.set('projects_index', this.index);
	}

	public delete(project: Project): void {
		let standarName = project.name.replace(/\s/g, '_');
		this.storageService.delete('project_' + standarName);
		delete this.index[standarName];
		this.storageService.set('projects_index', this.index);
	}

	public get(project: Project): any {
		let standarName = project.name.replace(/\s/g, '_');
		return this.storageService.get('project_' + standarName);
	}

	public load(): Array<any> {
		let projects = [];
		let results = [];

		for(let p in this.index) {
			let project = this.storageService.get('project_' + p);
			let projectObject = new Project(p);
			projectObject.toObject(project);
			results.push(projectObject);
		}

		return results;
	}
}
