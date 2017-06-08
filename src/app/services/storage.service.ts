import { Injectable } from '@angular/core';
import * as electron from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { FileService } from './files.service';

@Injectable()
export class StorageService {

	public dirname = path.resolve(electron.remote.app.getPath('userData') + '/storage/');

	constructor () {
		let fileService = new FileService();
		fileService.ensureDirectoryExistence(this.dirname);
	}

	public set(name: string, value: any): boolean {
		let file = name + '.json';
		let fullpath = path.join(this.dirname, file);
		fs.writeFileSync(fullpath, JSON.stringify(value));
		return true;
	}
	public delete(name: string): boolean{
		let file = name + '.json';
		let fullpath = path.join(this.dirname, file);
		fs.unlink(fullpath, function(err){
			if(err && err.code == 'ENOENT') {
		        // file doens't exist
		        console.info("File doesn't exist, won't remove it.");
		    } else if (err) {
		        // maybe we don't have enough permission
		        console.error("Error occurred while trying to remove file");
		    } else {
		        console.info(`removed`);
		    }
		});
		return true;
	}
	public get(name: string): any {
		let file = name + '.json';
		let fullpath = path.join(this.dirname, file);
		if (fs.existsSync(fullpath)) {
			let res = JSON.parse(fs.readFileSync(fullpath, {encoding: 'utf8'}))
			return res;
		}
		console.log('file not found', fullpath);
		return null;
	}
}
