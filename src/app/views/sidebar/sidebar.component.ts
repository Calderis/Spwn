import { Component, OnInit, Input } from '@angular/core';

import { Project } from '../../class/project';

@Component({
  selector: 'sidebar',
  providers: [],
  styleUrls: [ './sidebar.component.scss' ],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {

	@Input() session: any;

	constructor() {
	}

	ngOnInit() {
	}

  	public arrayOf(array: Array<Model>){
		let keys = [];
	    for (let key in array) {
	        keys.push(array[key]);
	    }
	    return keys;
	}

	public openProject(project: Project){
		project.projectDeployed = !project.projectDeployed
		this.session.project = project;
	}
	public openModel(project: Project){
		project.modelsDeployed = !project.modelsDeployed
		this.session.project = project;
	}
	public openModule(project: Project){
		project.modulesDeployed = !project.modulesDeployed;
		this.session.project = project;
	}
}