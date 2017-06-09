import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { StorageService } from './storage.service';

import { Project } from '../class/project';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ProjectService {

	private baseUrl = 'http://localhost:4040/api/';
	private headers = new Headers();
	private options: RequestOptions;
	public token: string = "";

	private index: Object = {};
	private storageService: StorageService = new StorageService();

	constructor (
		private http: Http) {
		this.index = this.storageService.get('projects_index');
		if(this.index == null) this.index = {};
	}

	public save(project: Project): void {
		if(project.id === undefined) {
			this.createProject(project).subscribe(
	            result => {
	            	project.toObject(result);
	            	this.saveLocally(project);
	            }, err => console.log(err));
		} else {
			this.updateProject(project).subscribe(
	            result => {
	            	project.toObject(result);
	            	this.saveLocally(project);
	            }, err => console.log(err));
		}
	}
	public saveLocally(project: Project): void{
		let standarName = project.id.replace(/\s/g, '_');
		this.storageService.set('project_' + standarName, project.toJson());
		this.index[standarName] = true;
		this.storageService.set('projects_index', this.index);
	}

	public delete(project: Project): void {
		let standarName = project.id.replace(/\s/g, '_');
		this.storageService.delete('project_' + standarName);
		delete this.index[standarName];
		this.storageService.set('projects_index', this.index);
	}

	public get(project: Project): any {
		let standarName = project.id.replace(/\s/g, '_');
		return this.storageService.get('project_' + standarName);
	}

	public load(): Array<any> {
		let results = [];

		for(let p in this.index) {
			let project = this.storageService.get('project_' + p);
			let projectObject = new Project(p);
			projectObject.toObject(project);
			results.push(projectObject);
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
	public getProjects(page: number = 1, limit: number = 10, params: string = ""): Observable<any> {
		this.setHeader();
		return this.http.get(this.baseUrl + 'projects?include=photos,active=0,1,2&page=' + page + '&limit=' + limit + params, this.options)
		.map((res:Response) => res.json() )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	public getProject(id: number): Observable<Project> {
		this.setHeader();
		return this.http.get(this.baseUrl + 'projects/' + id + "?include=photos,author,hashtags", this.options)
		.map((res:Response) => new Project(res.json()) )
		.catch((error:any) => Observable.throw(error || 'Server error'));
	}
	public deleteProject(project: Project): Observable<Object>{
		this.setHeader();
		return this.http.delete(this.baseUrl + 'projects/' + project.id, this.options)
		.map((res:Response) => new Project(res.json()))
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	public createProject(project: Project): Observable<Project> {
		this.setHeader();
		return this.http.post(this.baseUrl + 'projects', project.toJson(), this.options)
		.map((res:Response) => new Project(res.json()) )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	public updateProject(project: Project): Observable<Project> {
		this.setHeader();
		return this.http.put(this.baseUrl + 'projects/' + project.id, project.toJson(), this.options)
		.map((res:Response) => new Project(res.json()) )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
}
