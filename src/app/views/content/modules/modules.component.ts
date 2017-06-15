import { Component, OnInit, Input } from '@angular/core';

import { Project } from '../../../class/project';
import { Module } from '../../../class/module';
import { Template } from '../../../class/template';
import { User } from '../../../class/user';

import { UserService } from '../../../services/user.service';

@Component({
  selector: 'modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.scss'],
  providers: [UserService]
})
export class ModulesComponent implements OnInit {

	@Input() session: any;
	public project: Project = null;
	public currentModule: Module = null;
	public building: boolean = false;

	constructor(
		private userService: UserService) {
	}

	ngOnInit() {
		this.project = this.session.project;
	}

	// ————— PROJECT —————
	public saveProject(project: Project): void{
		project.build(false);
		this.userService.save(this.session.user);
	}
	public deleteProject(project: Project): void{
		for(var i = 0; i < this.session.user.projects.length; i++){
			if(this.session.user.projects[i] === project) this.session.user.projects.splice(i, 1);
		}
		this.session.page = 'new-project';
		this.userService.save(this.session.user);
	}
	public refresh(project: Project){
		// Used to refresh project
		console.log(project);
	}

	// ————— BUILD —————
	public focusDirectory(): void {
		document.getElementById("directory").click();
	}

	public build(event: any){
        let files: FileList = event.srcElement.files;

        for(var i = 0; i < this.project.modules.length; i++){
			this.project.modules[i].status.installed = false;;
			this.project.modules[i].status.installedOnline = false;;
		}
		this.building = true;

        this.project.build(files[0].path);

        this.userService.save(this.session.user);

        this.installationDone();
	}

	// Check that the project is done deploying
	// compiled:true
	// deployed:true
	// deployedOnline:true
	// installed:true
	// installedOnline:true
	// running:false
	// translated:true
	public installationDone(){
		let ok: boolean = true;
		for(var i = 0; i < this.project.modules.length; i++){
			let module = this.project.modules[i];
			if(!module.status.installed || !module.status.installedOnline){
				ok = false;
				setTimeout(()=>{
					this.installationDone();
				}, 500);
				break;
			}
		}
		if(ok) { this.building = false; }
	}
}
