import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { StorageService } from './storage.service';

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

	private index: Object = {};
	private storageService: StorageService = new StorageService();

	constructor (
		private http: Http) {
		this.index = this.storageService.get('<§ data.plurialName §>_index');
		if(this.index == null) this.index = {};
	}

	public save(<§ data.name §>: <§ data.className §>): void {
		let standarName = <§ data.name §>.id.replace(/\s/g, '_');
		this.storageService.set('<§ data.name §>_' + standarName, <§ data.name §>.toJson());
		this.index[standarName] = true;
		this.storageService.set('<§ data.plurialName §>_index', this.index);
	}

	public delete(<§ data.name §>: <§ data.className §>): void {
		let standarName = <§ data.name §>.id.replace(/\s/g, '_');
		this.storageService.delete('<§ data.name §>_' + standarName);
		delete this.index[standarName];
		this.storageService.set('<§ data.plurialName §>_index', this.index);
	}

	public get(<§ data.name §>: <§ data.className §>): any {
		let standarName = <§ data.name §>.id.replace(/\s/g, '_');
		return this.storageService.get('<§ data.name §>_' + standarName);
	}

	public load(): Array<any> {
		let results = [];

		for(let p in this.index) {
			let <§ data.name §> = this.storageService.get('<§ data.name §>_' + p);
			let <§ data.name §>Object = new <§ data.className §>(p);
			<§ data.name §>Object.toObject(<§ data.name §>);
			results.push(<§ data.name §>Object);
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
	public get<§ data.plurialClassName §>(page: number = 1, limit: number = 10, params: string = ""): Observable<any> {
		this.setHeader();
		return this.http.get(this.baseUrl + '<§ data.plurialName §>?include=photos,active=0,1,2&page=' + page + '&limit=' + limit + params, this.options)
		.map((res:Response) => res.json() )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	public get<§ data.className §>(id: number): Observable<<§ data.className §>> {
		this.setHeader();
		return this.http.get(this.baseUrl + '<§ data.plurialName §>/' + id + "?include=photos,author,hashtags", this.options)
		.map((res:Response) => res.json() )
		.catch((error:any) => Observable.throw(error || 'Server error'));
	}
	public delete<§ data.className §>(<§ data.name §>: <§ data.className §>): Observable<Object>{
		this.setHeader();
		return this.http.delete(this.baseUrl + '<§ data.plurialName §>/' + <§ data.name §>.id, this.options)
		.map((res:Response) => res.json())
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	public create<§ data.className §>(<§ data.name §>: <§ data.className §>, files: FileList = null): Observable<<§ data.className §>> {
		this.setHeader();
		return this.http.post(this.baseUrl + '<§ data.name §>', <§ data.name §>.toJson(), this.options)
		.map((res:Response) => res.json() )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	public update<§ data.className §>(<§ data.name §>: <§ data.className §>, files: FileList = null): Observable<<§ data.className §>> {
		this.setHeader();
		return this.http.post(this.baseUrl + '<§ data.plurialName §>/' + <§ data.name §>.id, <§ data.name §>.toJson(), this.options)
		.map((res:Response) => res.json() )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
}
