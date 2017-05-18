import { BrowserWindow as BrowserWindowElectron } from 'electron';
import * as electron from 'electron';
import { isDev } from './util';
import * as os from 'os';

export default class AppUpdater {

  public version: string;
  public updateAvailable = false;
  public autoUpdater;
  public notifier: Object = {};

  constructor() {
    if (isDev()) {
      console.log('Auto Update disabled on development mode');
      return;
    }

    const platform = os.platform();
    if (platform === 'linux') {
      console.log('Auto Update disabled on linux os');
      return;
    }

    this.version = electron.remote.app.getVersion();

    console.log(this.version);

    this.autoUpdater = require('electron').remote.require('electron-updater').autoUpdater;

    console.log('autoUpdater', this.autoUpdater);
    this.autoUpdater.autoDownload = false;

    this.autoUpdater.signals.updateDownloaded((it) => {
      let n = new Notification('New update downloaded', {body: `Version ${it.version} is ready`});
    });
    this.autoUpdater.on('checking-for-update', () => {
      // console.log('Checking for update...');
    });
    this.autoUpdater.on('update-available', (ev, info) => {
      console.log('update available', ev, info);
      let options = {
        body: `Version ${ev.version} is available`
      };
      let nUpdate = new Notification('New update available', options);
      this.updateAvailable = true;
    });
    this.autoUpdater.on('update-not-available', (ev, info) => {
      console.log('update not available', ev, info);
    });
    this.autoUpdater.on('error', (ev, err) => {
      console.log('error', ev, err);
    });
    this.autoUpdater.on('download-progress', (ev, progressObj) => {
      console.log('update progress', ev, progressObj);
    });
    this.autoUpdater.on('update-downloaded', (ev, info) => {
      console.log('update downloaded', ev, info);
      let n = new Notification('Update downloaded. Begin installation;');
      setTimeout(() => {
        this.autoUpdater.quitAndInstall();
      }, 3000);
    });

    this.autoUpdater.checkForUpdates();

  }
}
