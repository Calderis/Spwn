import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { StorageService } from './storage.service';

import { Model } from '../class/model';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ModelService {

	private baseUrl = 'https://localhost:4040/api/';
	private headers = new Headers();
	private options: RequestOptions;
	public token: string = "";

	private index: Object = {};
	private storageService: StorageService = new StorageService();

	constructor (
		private http: Http) {
		this.index = this.storageService.get('models_index');
		if(this.index == null) this.index = {};
	}

	public save(model: Model): void {
		let standarName = model.id.replace(/\s/g, '_');
		this.storageService.set('model_' + standarName, model.toJson());
		this.index[standarName] = true;
		this.storageService.set('models_index', this.index);
	}

	public delete(model: Model): void {
		let standarName = model.id.replace(/\s/g, '_');
		this.storageService.delete('model_' + standarName);
		delete this.index[standarName];
		this.storageService.set('models_index', this.index);
	}

	public get(model: Model): any {
		let standarName = model.id.replace(/\s/g, '_');
		return this.storageService.get('model_' + standarName);
	}

	public load(): Array<any> {
		let results = [];

		for(let p in this.index) {
			let model = this.storageService.get('model_' + p);
			let modelObject = new Model(p);
			modelObject.toObject(model);
			results.push(modelObject);
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
	public getModels(page: number = 1, limit: number = 10, params: string = ""): Observable<any> {
		this.setHeader();
		return this.http.get(this.baseUrl + 'models?include=photos,active=0,1,2&page=' + page + '&limit=' + limit + params, this.options)
		.map((res:Response) => res.json() )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	public getModel(id: number): Observable<Model> {
		this.setHeader();
		return this.http.get(this.baseUrl + 'models/' + id + "?include=photos,author,hashtags", this.options)
		.map((res:Response) => res.json() )
		.catch((error:any) => Observable.throw(error || 'Server error'));
	}
	public deleteModel(model: Model): Observable<Object>{
		this.setHeader();
		return this.http.delete(this.baseUrl + 'models/' + model.id, this.options)
		.map((res:Response) => res.json())
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	public createModel(model: Model, files: FileList = null): Observable<Model> {
		this.setHeader();
		return this.http.post(this.baseUrl + 'model', model.toJson(), this.options)
		.map((res:Response) => res.json() )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	public updateModel(model: Model, files: FileList = null): Observable<Model> {
		this.setHeader();
		return this.http.post(this.baseUrl + 'models/' + model.id, model.toJson(), this.options)
		.map((res:Response) => res.json() )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
}
