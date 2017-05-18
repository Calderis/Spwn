import { Injectable } from '@angular/core';
import { StorageService } from '../../storage/storage.service';

import { Project } from './project';

@Injectable()
export class ProjectService {

	private index: Object = {};

	constructor (
		private storageService: StorageService) {
		this.index = this.storageService.get('projects_index');
		if(this.index == null) this.index = {};
	}

	public save(project: Project): any {
		this.storageService.set('project_' + project.name, project.toJson());
		this.index[project.name] = true;
		this.storageService.set('projects_index', this.index);
	}

	public get(project: Project): any {
		return this.storageService.get('project_' + project.name);
	}

	public load(): Array<any> {
		let projects = [];
		let results = [];

		for(let p in this.index) {
			let project = this.storageService.get('project_' + p);
			let projectObject = new Project(this, p);
			projectObject.toObject(project);
			results.push(projectObject);
		}

		return results;
	}
}
