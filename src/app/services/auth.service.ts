import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

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


	constructor (
		private http: Http) {
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
		.map((res:Response) => {token: res.json().token, user: new User(res.json().user)} )
		.catch((error:any) => Observable.throw(error.json() || 'Server error'));
	}
}
