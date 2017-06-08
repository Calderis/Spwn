import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './views/home/home.component';
import { TraductorComponent } from './views/traductor/traductor.component';
import { ProjectsComponent } from './views/projects/projects.component';
import { ProjectDetailsComponent } from './views/projects/project-details/project-details.component';
import { ModuleDetailsComponent } from './views/projects/module-details/module-details.component';

import { AuthService } from './services/auth.service';

import { Keyobject } from './pipes/keyObject';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TraductorComponent,
    ProjectsComponent,
    ProjectDetailsComponent,
    ModuleDetailsComponent,
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
