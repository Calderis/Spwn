import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { StorageService } from './storage.service';

import { User } from '../class/user';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class UserService {

	private baseUrl = 'https://localhost:4040/api/';
	private headers = new Headers();
	private options: RequestOptions;
	public token: string = "";

	private index: Object = {};
	private storageService: StorageService = new StorageService();

	constructor (
		private http: Http) {
		this.index = this.storageService.get('users_index');
		if(this.index == null) this.index = {};
	}

	public save(user: User): void {
		let standarName = user.id.replace(/\s/g, '_');
		this.storageService.set('user_' + standarName, user.toJson());
		this.index[standarName] = true;
		this.storageService.set('users_index', this.index);
	}

	public delete(user: User): void {
		let standarName = user.id.replace(/\s/g, '_');
		this.storageService.delete('user_' + standarName);
		delete this.index[standarName];
		this.storageService.set('users_index', this.index);
	}

	public get(user: User): any {
		let standarName = user.id.replace(/\s/g, '_');
		return this.storageService.get('user_' + standarName);
	}

	public load(): Array<any> {
		let results = [];

		for(let p in this.index) {
			let user = this.storageService.get('user_' + p);
			let userObject = new User(p);
			userObject.toObject(user);
			results.push(userObject);
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
	public getUsers(page: number = 1, limit: number = 10, params: string = ""): Observable<any> {
		this.setHeader();
		return this.http.get(this.baseUrl + 'users?include=photos,active=0,1,2&page=' + page + '&limit=' + limit + params, this.options)
		.map((res:Response) => res.json() )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	public getUser(id: number): Observable<User> {
		this.setHeader();
		return this.http.get(this.baseUrl + 'users/' + id + "?include=photos,author,hashtags", this.options)
		.map((res:Response) => res.json() )
		.catch((error:any) => Observable.throw(error || 'Server error'));
	}
	public deleteUser(user: User): Observable<Object>{
		this.setHeader();
		return this.http.delete(this.baseUrl + 'users/' + user.id, this.options)
		.map((res:Response) => res.json())
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	public createUser(user: User, files: FileList = null): Observable<User> {
		this.setHeader();
		return this.http.post(this.baseUrl + 'user', user.toJson(), this.options)
		.map((res:Response) => res.json() )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	public updateUser(user: User, files: FileList = null): Observable<User> {
		this.setHeader();
		return this.http.post(this.baseUrl + 'users/' + user.id, user.toJson(), this.options)
		.map((res:Response) => res.json() )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
}
