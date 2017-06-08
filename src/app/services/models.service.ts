import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { StorageService } from '../../storage/storage.service';

import { Model } from '../models/model';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ModelService {

	private baseUrl = 'https://localhost:4040/api/';
	private headers = new Headers();
	private options: RequestOptions;
	public token: string = "";


	constructor (
		private http: Http,
		private storageService: StorageService) {
	}

	setHeader(): any {
		this.headers = new Headers();
		this.token = this.storageService.get("token");
		this.headers.append('Accept', 'application/json');
		this.headers.append('Authorization', 'Bearer ' + this.token );
		this.options = new RequestOptions({ headers: this.headers });
	}

	// ————— CRUD —————
	getModels(page: number = 1, limit: number = 10, params: string = ""): Observable<any> {
		this.setHeader();
		return this.http.get(this.baseUrl + 'models?include=photos,active=0,1,2&page=' + page + '&limit=' + limit + params, this.options)
		.map((res:Response) => this.dataToModel(res.json()) )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	getModel(id: number, probable: number = 0): Observable<Model> {
		this.setHeader();
		if(id == 0){
			return Observable.of(this.newModel(probable))
		}
		return this.http.get(this.baseUrl + 'models/' + id + "?include=photos,author,hashtags", this.options)
		.map((res:Response) => this.convertToModel(res.json()) )
		.catch((error:any) => Observable.throw(error || 'Server error'));
	}
	deleteModel(model: Model): Observable<Object>{
		this.setHeader();
		return this.http.delete(this.baseUrl + 'models/' + model.id, this.options)
		.map((res:Response) => res.json())
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	createModel(model: Model, files: FileList = null): Observable<Model> {
		this.setHeader();
		return this.http.post(this.baseUrl + 'model', this.setContentWithFiles(model.export_json(false), files), this.options)
		.map((res:Response) => this.convertToModel(res.json().data) )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	updateModel(model: Model, files: FileList = null): Observable<Model> {
		this.setHeader();
		return this.http.post(this.baseUrl + 'models/' + model.id, this.setContentWithFiles(model.export_json(false), files, true), this.options)
		.map((res:Response) => this.convertToModel(res.json()) )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
}
