import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { StorageService } from '../../storage/storage.service';

import { Project } from '../projects/project';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ProjectService {

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
	getProjects(page: number = 1, limit: number = 10, params: string = ""): Observable<any> {
		this.setHeader();
		return this.http.get(this.baseUrl + 'projects?include=photos,active=0,1,2&page=' + page + '&limit=' + limit + params, this.options)
		.map((res:Response) => this.dataToModel(res.json()) )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	getProject(id: number, probable: number = 0): Observable<Project> {
		this.setHeader();
		if(id == 0){
			return Observable.of(this.newProject(probable))
		}
		return this.http.get(this.baseUrl + 'projects/' + id + "?include=photos,author,hashtags", this.options)
		.map((res:Response) => this.convertToProject(res.json()) )
		.catch((error:any) => Observable.throw(error || 'Server error'));
	}
	deleteProject(project: Project): Observable<Object>{
		this.setHeader();
		return this.http.delete(this.baseUrl + 'projects/' + project.id, this.options)
		.map((res:Response) => res.json())
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	createProject(project: Project, files: FileList = null): Observable<Project> {
		this.setHeader();
		return this.http.post(this.baseUrl + 'project', this.setContentWithFiles(project.export_json(false), files), this.options)
		.map((res:Response) => this.convertToProject(res.json().data) )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
	updateProject(project: Project, files: FileList = null): Observable<Project> {
		this.setHeader();
		return this.http.post(this.baseUrl + 'projects/' + project.id, this.setContentWithFiles(project.export_json(false), files, true), this.options)
		.map((res:Response) => this.convertToProject(res.json()) )
		.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
	}
}
