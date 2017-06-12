'use strict';

const electron = require('electron');
const autoUpdater = require("electron-updater").autoUpdater
// Module to control application life.
const app = electron.app;
const { ipcMain } = require('electron')
const os = require('os');
const Menu = electron.Menu;
let menuTemplate = require('./menuTemplate');
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Allows for live-reload while developing the app
require('electron-reload')(__dirname + '/compil');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, menu, dockMenu;

let createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    'web-preferences': {
      'enable-drag-out': true, 
      'enable-drag-int': false 
    },
    frame: false
  });

  // and load the index.html of the app.
  mainWindow.loadURL('file:///' + __dirname + '/compil/index.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    toggleFileTasks(false);
    toggleNewWindowTask(true);

    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  if (!menu) setMenu();
  if (!dockMenu) setDock();

  toggleFileTasks(true);
  toggleNewWindowTask(false);
}

let toggleFileTasks = isEnabled => {
  // The 'File' menu should only be available if there is an open window
  menu.items
  .find(item => item.label === 'File')
  .submenu.items
  .forEach(subItem => subItem.enabled = isEnabled);
}

let toggleNewWindowTask = isEnabled => {
  // The 'New Window' task in the main menu and dock menu
  // should only be available if there are no open windows
  let newWindowMenu = menu.items
  .find(item => item.label === 'Window')
  .submenu.items
  .find(subItem => subItem.label === 'New');

  let dockWindowMenu = dockMenu.items
  .find(item => item.label === 'New Window');

  newWindowMenu.enabled = isEnabled;
  dockWindowMenu.enabled = isEnabled;
}

let setMenu = () => {
  // Set custom click handlers for menu tasks
  let fileMenu = menuTemplate
  .find(item => item.label === 'File');

  fileMenu.submenu
  .find(item => item.label === 'Open')
  .click = () => mainWindow.webContents.send('open-file')

  fileMenu.submenu
  .find(item => item.label === 'Save As...')
  .click = () => mainWindow.webContents.send('save-file')

  menuTemplate
  .find(item => item.label === 'Window')
  .submenu
  .find(subItem => subItem.label === 'New')
  .click = () => createWindow()

  menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

let setDock = () => {
  // Create a 'New Window' task in the dock menu (OSX only)
  dockMenu = Menu.buildFromTemplate([
    { label: 'New Window', click: createWindow }
    ]);
  app.dock.setMenu(dockMenu);
}

//-------------------------------------------------------------------
// Auto updates
//
// For details about these events, see the Wiki:
// https://github.com/electron-userland/electron-builder/wiki/Auto-Update#events
//
// The app doesn't need to listen to any events except `update-downloaded`
//
// Uncomment any of the below events to listen for them.  Also,
// look in the previous section to see them being used.
//-------------------------------------------------------------------

// autoUpdater.checkForUpdates();

// autoUpdater.on('checking-for-update', () => {
// })
// autoUpdater.on('update-available', (ev, info) => {
//   console.log("--------------- UPDATE AVAILABLE ---------------", ev, info);
// })
// autoUpdater.on('update-not-available', (ev, info) => {
//   console.log("--------------- UPDATE NOT AVAILABLE ---------------", ev, info);
// })
// // autoUpdater.on('error', (ev, err) => {
// // })
// // autoUpdater.on('download-progress', (ev, progressObj) => {
// // })
// autoUpdater.on('update-downloaded', (ev, info) => {
//   console.log("--------------- UPDATE DOWNLOADED ---------------");
//   // Wait 5 seconds, then quit and install
//   // In your application, you don't need to wait 5 seconds.
//   // You could call autoUpdater.quitAndInstall(); immediately
//   setTimeout(function() {
//     autoUpdater.quitAndInstall();  
//   }, 5000)
// })





// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function(){
  createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') {
  //   app.quit();
  // }
  app.quit();
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});