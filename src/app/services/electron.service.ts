import { Injectable } from '@angular/core';
import { remote } from 'electron';

@Injectable()
export class ElectronService {

	constructor () {
	}

	public minimize(): void {
		let window = remote.getCurrentWindow();
       	window.minimize(); 
	}
	public maximize(): void {
		let window = remote.getCurrentWindow();
		if (!window.isMaximized()) {
		   window.maximize();          
		} else {
		   window.unmaximize();
		}
	}
	public close(): void {
		let window = remote.getCurrentWindow();
		window.close();
	}
}
