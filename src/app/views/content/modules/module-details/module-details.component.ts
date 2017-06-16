import { Component, OnInit, Input } from '@angular/core';

import { Module } from '../../../../class/module';
import { Project } from '../../../../class/project';
import { Model } from '../../../../class/model';
import { Template } from '../../../../class/template';
import { User } from '../../../../class/user';

import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'module-details',
  templateUrl: './module-details.component.html',
  styleUrls: ['./module-details.component.scss'],
  providers: [UserService]
})
export class ModuleDetailsComponent implements OnInit {

	@Input() module: Module;
	@Input() session: any;
	public project: Project = null;

	public onlineControls: any = {};
	public localControls: any = {};

	public onlineMode: boolean = false;

	constructor(
		private userService: UserService) {
	}

	ngOnInit() {
		this.project = this.session.project;
		this.buildControlList();
	}

	public envControls(online): any{
		if(online){
			return this.onlineControls;
		} else {
			return this.localControls;
		}
	}

	public loadingDone(module: Module): boolean{
		if(module.template.type == 'API'){
			if(module.status.installedOnline){
				return true;
			}
		} else {
			if(module.status.installed){
				return true;
			}
		}
		return false;
	}

	// ————— CONTROLS —————
	public buildControlList(): void{
		for(let ctrl in this.module.controls){
			let control = this.module.controls[ctrl];
			control.expand = false; // Logs shown
			control.active = false;
			control.logs = '';
			control.child = null;
			this.onlineControls[ctrl] = control;
			this.localControls[ctrl] = control;
		}
	}
	public openConsole(control: any): void{
		control.expand = true;
		control.active = true;
	}
	public closeConsole(control: any): void{
		control.expand = false;
	}
	public startProcess(control: any): void{
		this.openConsole(control);
		this.module.spawnCmd(control.command.cmd, control.command.args, () => {}, false, control);
	}
	public killProcess(control: any): void{
		control.active = false;
		if(control.child.spawn != null) {
			control.child.spawn.kill();
			control.child.active = false;
		}
	}z

	public arrayOf(array: Array<Model>){
		let keys = [];
	    for (let key in array) {
	        keys.push(array[key]);
	    }
	    return keys;
	}
}
