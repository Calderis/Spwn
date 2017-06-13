import { Component, OnInit, Input } from '@angular/core';

import { ElectronService } from '../../services/electron.service';

@Component({
  selector: 'status-bar',
  providers: [],
  styleUrls: [ './status-bar.component.scss' ],
  templateUrl: './status-bar.component.html'
})
export class StatusBarComponent implements OnInit {

  public os: string = '';
  public electron: ElectronService = null;
  
  @Input() session: any;

  constructor() {
    this.os = process.platform;
    this.electron = new ElectronService();
  }

  ngOnInit() {
  }

  public minimize(): void{
    this.electron.minimize();
  }
  public maximize(): void{
    this.electron.maximize();
  }
  public close(): void{
    this.electron.close();
  }
}