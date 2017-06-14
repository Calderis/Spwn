import { Injectable } from '@angular/core';

import * as electron from 'electron';
import * as path from 'path';
import * as child_process from 'child_process';
import * as pty from 'pty.js';
import * as os from 'os';

import { FileService } from './files.service';

@Injectable()
export class TerminalService {

	private shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
	private rsaRegistered: boolean = false;

	constructor () {
		let fileService = new FileService();
	}

	public test(){
		console.log('------- TEST TERMINAL -------');
		let child = this.newChild('/Applications/Argyll/bin/spotread', []);
	}

	public newChild(cmd: string, args: Array<string>, logs: boolean = true, options: any = null, next = () => {}): any{
		let child;
		if(options !== null){
			child = pty.spawn(cmd, args), options;
		} else {
			child = pty.spawn(cmd, args);
		}
		
		if(logs){
			child.on('exit', function (code) {
			  console.log('child process exited with code ' + code, cmd, args);
			});
			child.on('data', function(data) {
			  console.log(data, cmd, args);
			});
		}
		child.on('exit', () => {
			console.log('EXIT', cmd, args);
		  	next();
		});

		return child;
	}
	public newChildDistant(cmd: string, args: Array<string>, logs: boolean = true, options: any = {folder:''}, next: any = () => {}): any{
		// Check if RSA key is set or not
		if(!this.rsaRegistered) {this.registerToServer(() => {
			return this.execDistantCommand(cmd, args, logs, options, next);
		});} else {
			return this.execDistantCommand(cmd, args, logs, options, next);
		}
	}

	private execDistantCommand(cmd: string, args: Array<string>, logs: boolean = true, options: any = {folder:''}, next: any = () => {}){
		// cmd on remote VPS
		// ssh root@vps421133.ovh.net "cd Yarn; npm run start"
		let argsArray = args.toString();
		let instruction = cmd + ' ' + argsArray.replace(/,/gi, ' ');
		let newArgs = ['root@vps421133.ovh.net', 'cd ' + options.folder + '; ' + instruction];
		return this.newChild('ssh', newArgs, logs, null, next);
	}

	public stop(){
		// this.child.kill('SIGHUP');;
	}

	// Generate RSA key
	// ssh-keygen -t rsa

	// Associate it to the server
	// ssh-copy-id -i ~/.ssh/id_rsa.pub root@vps421133.ovh.net

	// Connect to the server
	// ssh root@vps421133.ovh.net
	public registerToServer(next){
		let keyPath = ''; // Place where the key has been stored

		let instruction = 'ssh-keygen';
		let args = '-t rsa'.split(' ');
		let rsaQuest = this.newChild(instruction, args, false);

		rsaQuest.on('data', (data) => {
			let saveTheKey = new RegExp('Enter file in which to save the key', 'gi');
			let passphrase = new RegExp(/Enter .* passphrase/, 'gi');
			let overwrite = new RegExp('Overwrite (y/n)?', 'gi');
			let savedPlace = new RegExp('Your identification has been saved in ', 'gi');

			if(saveTheKey.test(data)){
				rsaQuest.write('\r'); // Just accept whithout any other infos
			} else if(overwrite.test(data)){
				rsaQuest.write('y\r'); // Accept
			} else if(passphrase.test(data)){
				rsaQuest.write('\r'); // Just accept whithout any other infos
			} else if(savedPlace.test(data)){
				keyPath = data.match(/.*id_rsa/)[0];
				keyPath = keyPath.replace(savedPlace, '');
			}
		});
		rsaQuest.on('exit', (code) => {
			let instruction = 'ssh-copy-id';
			let args = ('-i ' + keyPath + '.pub root@vps421133.ovh.net').split(' ');
			rsaQuest = this.newChild(instruction, args, false);

			rsaQuest.on('data', (data) => {
				let password = new RegExp('password:', 'gi');

				if(password.test(data)){
					rsaQuest.write('oO0Tus6W\r'); // Password for VPS
				}
			});

			rsaQuest.on('exit', (code) => {
				let instruction = 'ssh';
				let args = 'root@vps421133.ovh.net'.split(' ');
				rsaQuest = this.newChild(instruction, args, false);

				rsaQuest.on('data', (data) => {
					let sureToContinu = new RegExp('Are you sure you want to continue connecting (yes/no)?', 'gi');
					let password = new RegExp('password:', 'gi');
					let connexionSuccess = new RegExp('root@vps421133', 'gi');

					if(sureToContinu.test(data)){
						rsaQuest.write('yes\r'); // Accept
					} else if(password.test(data)){
						rsaQuest.write('oO0Tus6W\r'); // Password for VPS
					} else if(connexionSuccess.test(data)){
						rsaQuest.kill();
						this.rsaRegistered = true;
						next();
					}
				});
			});
		});
	}
}
