import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './views/content/home/home.component';
import { TraductorComponent } from './views/content/traductor/traductor.component';
import { ProjectsComponent } from './views/content/projects/projects.component';
import { ProjectDetailsComponent } from './views/content/projects/project-details/project-details.component';
import { ModuleDetailsComponent } from './views/content/projects/module-details/module-details.component';
import { SidebarComponent } from './views/sidebar/sidebar.component';
import { StatusBarComponent } from './views/status-bar/status-bar.component';
import { ContentComponent } from './views/content/content.component';

import { AuthService } from './services/auth.service';
import { ElectronService } from './services/electron.service';
import { ModelService } from './services/model.service';
import { ModuleService } from './services/module.service';
import { ParamService } from './services/param.service';
import { ProjectService } from './services/project.service';
import { TemplateService } from './services/template.service';
import { UserService } from './services/user.service';

import { Keyobject } from './pipes/keyObject';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TraductorComponent,
    ProjectsComponent,
    ProjectDetailsComponent,
    ModuleDetailsComponent,
    StatusBarComponent,
    SidebarComponent,
    ContentComponent,
    Keyobject
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [Keyobject, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
