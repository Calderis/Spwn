import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { <§ data.className §> } from '../class/<§ data.name §>';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class <§ data.className §>Service {

	private baseUrl = 'https://localhost:4040/api/';
	private headers = new Headers();
	private options: RequestOptions;
	public token: string = "";


	constructor (
		private http: Http,) {
	}

	setHeader(): any {
		this.headers = new Headers();
		this.token = this.storageService.get("token");
		this.headers.append('Accept', 'application/json');
		this.headers.append('Authorization', 'Bearer ' + this.token );
		this.options = new RequestOptions({ headers: this.headers });
	}

	// ————— CRUD —————
	get<§ data.plurialClassName §>(page: number = 1, limit: number = 10, params: string = ""): Observable<any> {
		this.setHeader();
		return this.http.get(this.baseUrl + '<§ data.plurialName §>?include=photos,active=0,1,2&page=' + page + '&limit=' + limit + params, this.options)
		.map((res:Response) => this.dataToModel(res.json()) )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	get<§ data.className §>(id: number, probable: number = 0): Observable<<§ data.className §>> {
		this.setHeader();
		if(id == 0){
			return Observable.of(this.new<§ data.className §>(probable))
		}
		return this.http.get(this.baseUrl + '<§ data.plurialName §>/' + id + "?include=photos,author,hashtags", this.options)
		.map((res:Response) => this.convertTo<§ data.className §>(res.json()) )
		.catch((error:any) => Observable.throw(error || 'Server error'));
	}
	delete<§ data.className §>(<§ data.name §>: <§ data.className §>): Observable<Object>{
		this.setHeader();
		return this.http.delete(this.baseUrl + '<§ data.plurialName §>/' + <§ data.name §>.id, this.options)
		.map((res:Response) => res.json())
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	create<§ data.className §>(<§ data.name §>: <§ data.className §>, files: FileList = null): Observable<<§ data.className §>> {
		this.setHeader();
		return this.http.post(this.baseUrl + '<§ data.name §>', this.setContentWithFiles(<§ data.name §>.export_json(false), files), this.options)
		.map((res:Response) => this.convertTo<§ data.className §>(res.json().data) )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	update<§ data.className §>(<§ data.name §>: <§ data.className §>, files: FileList = null): Observable<<§ data.className §>> {
		this.setHeader();
		return this.http.post(this.baseUrl + '<§ data.plurialName §>/' + <§ data.name §>.id, this.setContentWithFiles(<§ data.name §>.export_json(false), files, true), this.options)
		.map((res:Response) => this.convertTo<§ data.className §>(res.json()) )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
}
