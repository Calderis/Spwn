import { Injectable } from '@angular/core';
import * as fs from 'fs';



@Injectable()
export class StorageService {

	constructor () {
	}

	set(name: string, value: any): boolean {
		let path = 'storage/' + name + '_storage.json';
		fs.writeFileSync(path, JSON.stringify(value));
		return true;
	}
	get(name: string): any {
		let path = 'storage/' + name + '_storage.json';
		if (fs.existsSync(path)) {
			let res = JSON.parse(fs.readFileSync(path, {encoding: "utf8"}))
			return res
		}
		console.log("file not found", path);
		return null
	}
}
