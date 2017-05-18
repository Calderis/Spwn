import { Injectable } from '@angular/core';
import * as electron from 'electron';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StorageService {

		public dirname = path.resolve(electron.remote.app.getPath('userData') + '/storage/');

		constructor () {
			ensureDirectoryExistence(this.dirname);
		}

		public set(name: string, value: any): boolean {
			let file = name + '.json';
			let fullpath = path.join(this.dirname, file);
			fs.writeFileSync(fullpath, JSON.stringify(value));
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

	function ensureDirectoryExistence(filePath) {
		if (fs.existsSync(filePath)) {
			return true;
		}
		fs.mkdirSync(filePath);
	}

	function listFiles(dirname){
		console.log('—————————— LIST FILES ——————————');
		console.log(dirname);
		fs.readdir(path.resolve(dirname), (err, files) => {
			files.forEach((file) => {
				console.log(file);
			});
		});
		console.log('—————————— LIST FILES ——————————');
}
