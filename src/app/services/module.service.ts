import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { StorageService } from './storage.service';

import { Project } from '../class/project';
import { Module } from '../class/module';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ModuleService {

	private baseUrl = 'http://151.80.141.50:4040/api/';
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
		if(module.id === undefined) {
			this.createModule(module).subscribe(
	            result => {
	            	module.toObject(result);
	            	this.saveLocally(module);
	            }, err => console.log(err));
		} else {
			this.updateModule(module).subscribe(
	            result => {
	            	module.toObject(result);
	            	this.saveLocally(module);
	            }, err => console.log(err));
		}
	}
	public saveLocally(module: Module): void{
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
			let project = new Project(p);
			let module = this.storageService.get('module_' + p);
			let moduleObject = new Module(project, module);
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
		return this.http.get(this.baseUrl + 'modules?page=' + page + '&limit=' + limit + params, this.options)
		.map((res:Response) => {
			let results = res.json();
			for(var i = 0; i < results.length; i++){
				results[i] = new Module(results[i]);
			}
			return results
		} )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	public getModule(id: string): Observable<Module> {
		this.setHeader();
		return this.http.get(this.baseUrl + 'modules/' + id, this.options)
		.map((res:Response) => new Module(res.json()) )
		.catch((error:any) => Observable.throw(error || 'Server error'));
	}
	public deleteModule(module: Module): Observable<Object>{
		this.setHeader();
		return this.http.delete(this.baseUrl + 'modules/' + module.id, this.options)
		.map((res:Response) => new Module(res.json()))
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	public createModule(module: Module): Observable<Module> {
		this.setHeader();
		return this.http.post(this.baseUrl + 'modules', module.toJson(), this.options)
		.map((res:Response) => new Module(res.json()) )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	public updateModule(module: Module): Observable<Module> {
		this.setHeader();
		return this.http.put(this.baseUrl + 'modules/' + module.id, module.toJson(), this.options)
		.map((res:Response) => new Module(res.json()) )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
}
