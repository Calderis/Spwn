import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { StorageService } from '../../storage/storage.service';

import { Template } from '../templates/template';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class TemplateService {

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
	getTemplates(page: number = 1, limit: number = 10, params: string = ""): Observable<any> {
		this.setHeader();
		return this.http.get(this.baseUrl + 'templates?include=photos,active=0,1,2&page=' + page + '&limit=' + limit + params, this.options)
		.map((res:Response) => this.dataToModel(res.json()) )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	getTemplate(id: number, probable: number = 0): Observable<Template> {
		this.setHeader();
		if(id == 0){
			return Observable.of(this.newTemplate(probable))
		}
		return this.http.get(this.baseUrl + 'templates/' + id + "?include=photos,author,hashtags", this.options)
		.map((res:Response) => this.convertToTemplate(res.json()) )
		.catch((error:any) => Observable.throw(error || 'Server error'));
	}
	deleteTemplate(template: Template): Observable<Object>{
		this.setHeader();
		return this.http.delete(this.baseUrl + 'templates/' + template.id, this.options)
		.map((res:Response) => res.json())
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	createTemplate(template: Template, files: FileList = null): Observable<Template> {
		this.setHeader();
		return this.http.post(this.baseUrl + 'template', this.setContentWithFiles(template.export_json(false), files), this.options)
		.map((res:Response) => this.convertToTemplate(res.json().data) )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	updateTemplate(template: Template, files: FileList = null): Observable<Template> {
		this.setHeader();
		return this.http.post(this.baseUrl + 'templates/' + template.id, this.setContentWithFiles(template.export_json(false), files, true), this.options)
		.map((res:Response) => this.convertToTemplate(res.json()) )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
}
