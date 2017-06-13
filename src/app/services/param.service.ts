import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { StorageService } from './storage.service';

import { Param } from '../class/param';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ParamService {

	private baseUrl = 'http://151.80.141.50:4040/api/';
	private headers = new Headers();
	private options: RequestOptions;
	public token: string = "";

	private index: Object = {};
	private storageService: StorageService = new StorageService();

	constructor (
		private http: Http) {
		this.index = this.storageService.get('params_index');
		if(this.index == null) this.index = {};
	}

	public save(param: Param): void {
		if(param.id === undefined) {
			this.createParam(param).subscribe(
	            result => {
	            	param.toObject(result);
	            	this.saveLocally(param);
	            }, err => console.log(err));
		} else {
			this.updateParam(param).subscribe(
	            result => {
	            	param.toObject(result);
	            	this.saveLocally(param);
	            }, err => console.log(err));
		}
	}
	public saveLocally(param: Param): void{
		let standarName = param.id.replace(/\s/g, '_');
		this.storageService.set('param_' + standarName, param.toJson());
		this.index[standarName] = true;
		this.storageService.set('params_index', this.index);
	}

	public delete(param: Param): void {
		let standarName = param.id.replace(/\s/g, '_');
		this.storageService.delete('param_' + standarName);
		delete this.index[standarName];
		this.storageService.set('params_index', this.index);
	}

	public get(param: Param): any {
		let standarName = param.id.replace(/\s/g, '_');
		return this.storageService.get('param_' + standarName);
	}

	public load(): Array<any> {
		let results = [];

		for(let p in this.index) {
			let param = this.storageService.get('param_' + p);
			let paramObject = new Param(p);
			paramObject.toObject(param);
			results.push(paramObject);
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
	public getParams(page: number = 1, limit: number = 10, params: string = ""): Observable<any> {
		this.setHeader();
		return this.http.get(this.baseUrl + 'params?page=' + page + '&limit=' + limit + params, this.options)
		.map((res:Response) => {
			let results = res.json();
			for(var i = 0; i < results.length; i++){
				results[i] = new Param(results[i]);
			}
			return results
		} )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	public getParam(id: string): Observable<Param> {
		this.setHeader();
		return this.http.get(this.baseUrl + 'params/' + id, this.options)
		.map((res:Response) => new Param(res.json()) )
		.catch((error:any) => Observable.throw(error || 'Server error'));
	}
	public deleteParam(param: Param): Observable<Object>{
		this.setHeader();
		return this.http.delete(this.baseUrl + 'params/' + param.id, this.options)
		.map((res:Response) => new Param(res.json()))
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	public createParam(param: Param): Observable<Param> {
		this.setHeader();
		return this.http.post(this.baseUrl + 'params', param.toJson(), this.options)
		.map((res:Response) => new Param(res.json()) )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	public updateParam(param: Param): Observable<Param> {
		this.setHeader();
		return this.http.put(this.baseUrl + 'params/' + param.id, param.toJson(), this.options)
		.map((res:Response) => new Param(res.json()) )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
}
