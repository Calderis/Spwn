import {
  Component,
  OnInit
} from '@angular/core';

import { AppState } from '../app.service';
import { Title } from './title';
import { XLargeDirective } from './x-large';

import * as electron from 'electron';
import AppUpdater from '../AppUpdater';

import { Project } from '../models/project/project';
import { Traductors } from '../traductors/traductors';
import { ProjectService } from '../models/project/project.service';
import { StorageService } from '../storage/storage.service';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'home',  // <home></home>
  // We need to tell Angular's Dependency Injection which providers are in our app.
  providers: [Title, ProjectService, StorageService],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './home.component.scss' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  // Set our default values
  public localState = { value: '' };
  public version = '';
  public appUpdater;
  public notif = {update: false};
  public projects = [];
  public traductors: Traductors = null;

  // TypeScript public modifiers
  constructor(
    public appState: AppState,
    public title: Title,
    public projectService: ProjectService
    ) {

    this.traductors = new Traductors();

    this.version = electron.remote.app.getVersion();
    this.appUpdater = new AppUpdater();
    setTimeout(() => {
      this.notif.update = this.appUpdater.updateAvailable;
    }, 5000);

    this.projects = projectService.load();

    // let project = new Project(this.projectService, 'Projet de test');
    // this.projects.push(project);

    console.log(this.projects);

  }

  public ngOnInit() {
    // console.log('hello `Home` component');
    // this.title.getData().subscribe(data => this.data = data);
  }

  // Create new project
  public createProject(event: any) {
    if (event.key === 'Enter') {
      // Create project
      let project = new Project(this.projectService, event.srcElement.value);
      this.projects.push(project);
      // Reset input value
      event.srcElement.value = '';
      // Log projet
      console.log('Create project', project);

      return project;
    }
    return false;
  }

  public updateSoftware() {
    this.appUpdater.autoUpdater.downloadUpdate();
  }

  public submitState(value: string) {
    // console.log('submitState', value);
    this.appState.set('value', value);
    this.localState.value = '';
  }

  public prettyPrint(event) {
    let value = event.srcElement.value;
    if (isJSON(value)) {

      //the json is ok
      let obj = JSON.parse(value);
      let pretty = JSON.stringify(obj, undefined, 4);
      event.srcElement.value = pretty;

    }
  }
}

function isJSON(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
