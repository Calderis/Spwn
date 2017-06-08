import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { StorageService } from '../../storage/storage.service';

import { User } from '../users/user';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class UserService {

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
	getUsers(page: number = 1, limit: number = 10, params: string = ""): Observable<any> {
		this.setHeader();
		return this.http.get(this.baseUrl + 'users?include=photos,active=0,1,2&page=' + page + '&limit=' + limit + params, this.options)
		.map((res:Response) => this.dataToModel(res.json()) )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	getUser(id: number, probable: number = 0): Observable<User> {
		this.setHeader();
		if(id == 0){
			return Observable.of(this.newUser(probable))
		}
		return this.http.get(this.baseUrl + 'users/' + id + "?include=photos,author,hashtags", this.options)
		.map((res:Response) => this.convertToUser(res.json()) )
		.catch((error:any) => Observable.throw(error || 'Server error'));
	}
	deleteUser(user: User): Observable<Object>{
		this.setHeader();
		return this.http.delete(this.baseUrl + 'users/' + user.id, this.options)
		.map((res:Response) => res.json())
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	createUser(user: User, files: FileList = null): Observable<User> {
		this.setHeader();
		return this.http.post(this.baseUrl + 'user', this.setContentWithFiles(user.export_json(false), files), this.options)
		.map((res:Response) => this.convertToUser(res.json().data) )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	updateUser(user: User, files: FileList = null): Observable<User> {
		this.setHeader();
		return this.http.post(this.baseUrl + 'users/' + user.id, this.setContentWithFiles(user.export_json(false), files, true), this.options)
		.map((res:Response) => this.convertToUser(res.json()) )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
}
