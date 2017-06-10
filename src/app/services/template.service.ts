import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { StorageService } from './storage.service';
import { FileService } from './file.service';
import * as fs from 'fs';
import * as path from 'path';
import * as $ from 'jquery';
import * as http from 'http';
import * as FormData from 'form-data';
import * as AdmZip from 'adm-zip';

import { Template } from '../class/template';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class TemplateService {

	private baseUrl = 'http://localhost:4040/api/';
	private headers = new Headers();
	private options: RequestOptions;
	public token: string = "";

	private index: Object = {};
	private storageService: StorageService = new StorageService();

	constructor (
		private http: Http) {
		this.index = this.storageService.get('templates_index');
		if(this.index == null) this.index = {};
	}

	public save(template: Template): void {
		if(template.id === undefined) {
			this.createTemplate(template).subscribe(
	            result => {
	            	template.toObject(result);
	            	this.saveLocally(template);
	            }, err => console.log(err));
		} else {
			this.updateTemplate(template).subscribe(
	            result => {
	            	template.toObject(result);
	            	this.saveLocally(template);
	            }, err => console.log(err));
		}
	}
	public saveLocally(template: Template): void{
		let standarName = template.id.replace(/\s/g, '_');
		this.storageService.set('template_' + standarName, template.toJson());
		this.index[standarName] = true;
		this.storageService.set('templates_index', this.index);
	}

	public delete(template: Template): void {
		let standarName = template.id.replace(/\s/g, '_');
		this.storageService.delete('template_' + standarName);
		delete this.index[standarName];
		this.storageService.set('templates_index', this.index);
	}

	public get(template: Template): any {
		let standarName = template.id.replace(/\s/g, '_');
		return this.storageService.get('template_' + standarName);
	}

	public load(): Array<any> {
		let results = [];

		for(let p in this.index) {
			let template = this.storageService.get('template_' + p);
			let templateObject = new Template(p);
			templateObject.toObject(template);
			results.push(templateObject);
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
	public getTemplates(page: number = 1, limit: number = 10, params: string = ""): Observable<any> {
		this.setHeader();
		return this.http.get(this.baseUrl + 'templates?page=' + page + '&limit=' + limit + params, this.options)
		.map((res:Response) => {
			let results = res.json();
			for(var i = 0; i < results.length; i++){
				results[i] = new Template(results[i]);
			}
			return results
		} )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	public getTemplate(id: number): Observable<Template> {
		this.setHeader();
		return this.http.get(this.baseUrl + 'templates/' + id, this.options)
		.map((res:Response) => new Template(res.json()) )
		.catch((error:any) => Observable.throw(error || 'Server error'));
	}
	public deleteTemplate(template: Template): Observable<Object>{
		this.setHeader();
		return this.http.delete(this.baseUrl + 'templates/' + template.id, this.options)
		.map((res:Response) => new Template(res.json()))
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	public createTemplate(template: Template): Observable<Template> {
		this.setHeader();
		return this.http.post(this.baseUrl + 'templates', template.toJson(), this.options)
		.map((res:Response) => new Template(res.json()) )
		.catch((error:any) => Observable.throw(error || 'Server error'));
	}
	public uploadTemplate(template: Template, file: string): Observable<Template> {
		this.headers = new Headers();
		this.headers.append('content-type', 'multipart/form-data');
		this.headers.append('Authorization', 'Bearer ' + this.storageService.get("token") );
		this.options = new RequestOptions({ headers: this.headers });

		let formData = new FormData();
		formData.append('template', fs.createReadStream(file));

		var http = require('http');

		var request = http.request({
		  method: 'post',
		  host: 'localhost',
		  port: 4040,
		  path: '/api/templates/file',
		  headers: formData.getHeaders()
		});

		formData.pipe(request);

		request.on('response', function(res) {
		  console.log(res);
		});

		// return this.http.post(this.baseUrl + 'templates/file', formData, this.options)
		// .map((res:Response) => res )
		// .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	public downloadTemplate(id: number): Observable<Template> {

		this.setHeader();
		return this.http.get(this.baseUrl + 'templates/file/' + id, this.options)
		.map((res:Response) => res)
		.catch((error:any) => Observable.throw(error || 'Server error'));
	}
	public updateTemplate(template: Template): Observable<Template> {
		this.setHeader();
		return this.http.put(this.baseUrl + 'templates/' + template.id, template.toJson(), this.options)
		.map((res:Response) => new Template(res.json()) )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
}
