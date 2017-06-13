import { Component, OnInit, Input } from '@angular/core';

import { Project } from '../../../class/project';

@Component({
  selector: 'new-project',
  providers: [],
  styleUrls: [ './new-project.component.scss' ],
  templateUrl: './new-project.component.html'
})
export class NewProjectComponent implements OnInit {

  @Input() session:  any;
  public projectName: string = '';
  public projectDescription: string = '';
  public error: boolean = false;

  constructor() {
  }

  public ngOnInit() {
  }

  // Create new project
  public createProject(): void {
    if(this.projectName !== ''){
      // Create project
      let project = new Project(this.projectName);
      project.description = this.projectDescription;
      project.setPort();
      project.owner = this.session.user;
      this.session.user.projects.push(project);
      // Reset input value
      this.projectName = '';
      this.projectDescription = '';
      // Select project
      this.session.project = project;
      this.session.project.openProject();
      // Change Page
      this.session.page = 'models';
    } else {
      this.error = true;
    }
  }

}