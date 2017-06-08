import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { StorageService } from './storage.service';

import { User } from '../class/user';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class AuthService {

	private baseUrl = 'http://localhost:4040/api/auth';
	private headers = new Headers();
	private options: RequestOptions;
	public token: string = "";

	private storageService: StorageService = new StorageService();

	constructor (
		private http: Http) {
		this.index = this.storageService.get('auth_index');
		if(this.index == null) this.index = {};
	}

	public save(log: any): void {
		let standarName = log.user.id.replace(/\s/g, '_');
		this.storageService.set('auth_' + standarName, {token: log.token, user: log.user.toJson()});
		this.index[standarName] = true;
		this.storageService.set('auth_index', this.index);
	}

	public delete(user: User): void {
		let standarName = user.id.replace(/\s/g, '_');
		this.storageService.delete('auth_' + standarName);
		delete this.index[standarName];
		this.storageService.set('auth_index', this.index);
	}

	public get(user: User): any {
		let standarName = user.id.replace(/\s/g, '_');
		let result = this.storageService.get('auth_' + standarName);
		let user = new User();
		console.log(result.user);
		return {token: result.token, user: user.toObject(result.user)});
	}

	public load(): Array<User> {
		let results = [];

		for(let p in this.index) {
			let user = this.storageService.get('auth_' + p);
			results.push(user);
		}

		return results;
	}

	private saveLogguedUser(token: string, user: any): any{
		let newUser = new User();
		newUser.toObject(user);
		let result = {token: token, user: newUser};
		this.save(result);
		return result; 
	}

	setHeader(): any {
		this.headers = new Headers();
		this.headers.append('Accept', 'application/json');
		this.options = new RequestOptions({ headers: this.headers });
	}

	// ————— CRUD —————
	login(email: string = '', password: string = ''): Observable<any> {
		this.setHeader();
		return this.http.post(this.baseUrl + '/login', {email:email, password:password}, this.options)
		.map((res:Response) => this.saveLogguedUser(res.json().token, res.json().user))
		.catch((error:any) => Observable.throw(error || 'Server error'));
	}
}
