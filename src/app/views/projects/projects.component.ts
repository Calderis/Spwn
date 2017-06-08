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

}