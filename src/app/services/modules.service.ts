import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { StorageService } from '../../storage/storage.service';

import { Param } from '../params/param';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ParamService {

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
	getParams(page: number = 1, limit: number = 10, params: string = ""): Observable<any> {
		this.setHeader();
		return this.http.get(this.baseUrl + 'params?include=photos,active=0,1,2&page=' + page + '&limit=' + limit + params, this.options)
		.map((res:Response) => this.dataToModel(res.json()) )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	getParam(id: number, probable: number = 0): Observable<Param> {
		this.setHeader();
		if(id == 0){
			return Observable.of(this.newParam(probable))
		}
		return this.http.get(this.baseUrl + 'params/' + id + "?include=photos,author,hashtags", this.options)
		.map((res:Response) => this.convertToParam(res.json()) )
		.catch((error:any) => Observable.throw(error || 'Server error'));
	}
	deleteParam(param: Param): Observable<Object>{
		this.setHeader();
		return this.http.delete(this.baseUrl + 'params/' + param.id, this.options)
		.map((res:Response) => res.json())
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	createParam(param: Param, files: FileList = null): Observable<Param> {
		this.setHeader();
		return this.http.post(this.baseUrl + 'param', this.setContentWithFiles(param.export_json(false), files), this.options)
		.map((res:Response) => this.convertToParam(res.json().data) )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	updateParam(param: Param, files: FileList = null): Observable<Param> {
		this.setHeader();
		return this.http.post(this.baseUrl + 'params/' + param.id, this.setContentWithFiles(param.export_json(false), files, true), this.options)
		.map((res:Response) => this.convertToParam(res.json()) )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
}
