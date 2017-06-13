import { Component, OnInit, Input } from '@angular/core';

import { UserService } from '../../../services/user.service';
import { StorageService } from '../../../services/storage.service';

import { Project } from '../../../class/project';
import { User } from '../../../class/user';

import { ProjectDetailsComponent } from './project-details/project-details.component';

@Component({
  selector: 'projects',
  providers: [UserService, StorageService],
  styleUrls: [ './projects.component.scss' ],
  templateUrl: './projects.component.html'
})
export class ProjectsComponent implements OnInit {

  @Input() session: any;
  public projectSelected: Project = null;

  constructor(
    public userService: UserService
    ) {
    if(this.session === null || this.session === undefined) this.session = new User();
      for(var i = 0; i < this.session.projects.length; i++){
        this.session.projects[i].build(null);
      }
  }

  public ngOnInit() {
  }

  public saveProject(project: Project): void{
    project.build('');
    this.userService.save(this.session);
  }
  public deleteProject(project: Project): void{
    for(var i = 0; i < this.session.projects.length; i++){
      if(this.session.projects[i] === project) this.session.projects.splice(i, 1);
    }
    this.projectSelected = null;
    this.userService.save(this.session);
  }

}