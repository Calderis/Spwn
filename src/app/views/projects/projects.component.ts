import { Component, OnInit } from '@angular/core';

import { ProjectService } from '../../services/project.service';
import { StorageService } from '../../services/storage.service';

import { Project } from '../../class/project';

import { ProjectDetailsComponent } from './project-details/project-details.component';

@Component({
  selector: 'projects',
  providers: [ProjectService, StorageService],
  styleUrls: [ './projects.component.scss' ],
  templateUrl: './projects.component.html'
})
export class ProjectsComponent implements OnInit {

  public projectSelected: Project = null;
  public projects: Array<Project> = [];

  constructor(
    public projectService: ProjectService
    ) {
    this.projects = projectService.load();
    for(var i = 0; i < this.projects.length; i++){
      this.projects[i].build();
    }
  }

  public ngOnInit() {
    // console.log('hello `Project` component');
  }

  // Create new project
  public createProject(event: any) {
    if (event.key === 'Enter') {
      // Create project
      let project = new Project(event.target.value);
      this.projects.push(project);
      // Reset input value
      event.srcElement.value = '';
      // Log projet
      console.log('Create project', project);

      return project;
    }
    return false;
  }

  public saveProject(project: Project): void{
    project.build();
    this.projectService.save(project);
  }
  public deleteProject(project: Project): void{
    this.projectService.delete(project);
    for(var i = 0; i < this.projects.length; i++){
      this.projects.splice(i, 1);
    }
    this.projectSelected = null;
  }

}