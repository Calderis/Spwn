import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { StorageService } from './storage.service';

import { Module } from '../class/module';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ModuleService {

	private baseUrl = 'https://localhost:4040/api/';
	private headers = new Headers();
	private options: RequestOptions;
	public token: string = "";

	private index: Object = {};
	private storageService: StorageService = new StorageService();

	constructor (
		private http: Http) {
		this.index = this.storageService.get('modules_index');
		if(this.index == null) this.index = {};
	}

	public save(module: Module): void {
		let standarName = module.id.replace(/\s/g, '_');
		this.storageService.set('module_' + standarName, module.toJson());
		this.index[standarName] = true;
		this.storageService.set('modules_index', this.index);
	}

	public delete(module: Module): void {
		let standarName = module.id.replace(/\s/g, '_');
		this.storageService.delete('module_' + standarName);
		delete this.index[standarName];
		this.storageService.set('modules_index', this.index);
	}

	public get(module: Module): any {
		let standarName = module.id.replace(/\s/g, '_');
		return this.storageService.get('module_' + standarName);
	}

	public load(): Array<any> {
		let results = [];

		for(let p in this.index) {
			let module = this.storageService.get('module_' + p);
			let moduleObject = new Module(p);
			moduleObject.toObject(module);
			results.push(moduleObject);
		}

		return results;
	}

	private setHeader(): any {
		this.headers = new Headers();
		this.token = this.storageService.get("token");
		this.headers.append('Accept', 'application/json');
		this.headers.append('Authorization', 'Bearer ' + this.token );
		this.options = new RequestOptions({ headers: this.headers });
	}

	// ————— CRUD —————
	public getModules(page: number = 1, limit: number = 10, params: string = ""): Observable<any> {
		this.setHeader();
		return this.http.get(this.baseUrl + 'modules?include=photos,active=0,1,2&page=' + page + '&limit=' + limit + params, this.options)
		.map((res:Response) => res.json() )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	public getModule(id: number): Observable<Module> {
		this.setHeader();
		return this.http.get(this.baseUrl + 'modules/' + id + "?include=photos,author,hashtags", this.options)
		.map((res:Response) => res.json() )
		.catch((error:any) => Observable.throw(error || 'Server error'));
	}
	public deleteModule(module: Module): Observable<Object>{
		this.setHeader();
		return this.http.delete(this.baseUrl + 'modules/' + module.id, this.options)
		.map((res:Response) => res.json())
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	public createModule(module: Module, files: FileList = null): Observable<Module> {
		this.setHeader();
		return this.http.post(this.baseUrl + 'module', module.toJson(), this.options)
		.map((res:Response) => res.json() )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	public updateModule(module: Module, files: FileList = null): Observable<Module> {
		this.setHeader();
		return this.http.post(this.baseUrl + 'modules/' + module.id, module.toJson(), this.options)
		.map((res:Response) => res.json() )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
}