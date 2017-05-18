import { Component } from '@angular/core';
import { Project } from '../models/project/project';
import { Balise } from '../models/balise/balise';
import * as fs from 'fs';
import * as path from 'path';
import { spawn, exec } from 'child_process';

@Component({})

export class Language {

		public dirname = '.';
		public files = [];
		public output: string = '';
		public project: Project;

		constructor() {

		}

		public readFiles() {
			fs.readdir(path.resolve(this.dirname + '/template'), (err, files) => {
				this.files = files;
			})
		}

		public buildFromTemplate(dir: string, template: string, type: string = 'unique', data: any): boolean{
			if(type === 'multiple') {
				if(typeof data.length === 'number') {
					for(let i = 0; i < data.length; i++) {
						let file = data[i].name + 's.' + template.split('.').pop();
						// console.log(path.join(this.output, template.replace(/§_.*/, file)));
						fs.writeFileSync(path.join(this.output, template.replace(/§_.*/, file)), this.translateFile(path.resolve(path.join(dir, template)), data[i]));
					}
					deleteFile(this.output, template);
					return true;
				}
				console.log('Err: Data should be an array.');
				return false;
			}
			fs.writeFileSync(path.join(this.output, template.replace('§_', '')), this.translateFile(path.resolve(path.join(dir, template)), data));
			deleteFile(this.output, template);
			return true;
		}

		public translateFile(file: string, data: any): string{
			let template = fs.readFileSync(file, {encoding: 'utf8'});
			let balise = new Balise('body', template, {data:data});
			return balise.content;
		}

		public setOutput(dir: string = './output/'): void {
			ensureDirectoryExistence(dir);
			this.output = path.resolve(dir);
		}

		public compilFiles(f: Array<any>): void {
			// deleteDirectory(this.output);
			copyFolderRecursiveSync(this.dirname + '/template/.', this.output);
			for(let i = 0; i < f.length; i++) {
				this.buildFromTemplate(this.dirname + '/template/', f[i].template, f[i].type, this.project.models);
			}
			console.log('Files created.');
		}

		public execCmd(cmd: string, args: string) {
			console.log('( cd ' + path.resolve(this.output) + ' ; ' + cmd + ' ' + args + ' )');
			exec('( cd ' + path.resolve(this.output) + ' ; ' + cmd + ' ' + args + ' )');
		}
}

function ensureDirectoryExistence(filePath) {
	if (fs.existsSync(filePath)) {
		return true;
	}
	fs.mkdirSync(filePath);
}

function copyFileSync( source, target ) {

    let targetFile = target;

    //if target is a directory a new file with the same name will be created
    if ( fs.existsSync( target ) ) {
        if ( fs.lstatSync( target ).isDirectory() ) {
            targetFile = path.join( target, path.basename( source ) );
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync( source, target ) {
    let files = [];

    //check if folder needs to be created or integrated
    let targetFolder = path.join( target, path.basename( source ) );
    if ( !fs.existsSync( targetFolder ) ) {
        fs.mkdirSync( targetFolder );
    }

    //copy
    if ( fs.lstatSync( source ).isDirectory() ) {
        files = fs.readdirSync( source );
        files.forEach( function( file ) {
            let curSource = path.join( source, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) {
                copyFolderRecursiveSync( curSource, targetFolder );
            } else {
                copyFileSync( curSource, targetFolder );
            }
        } );
    }
}

function deleteFile(dir, file) {
    return new Promise(function(resolve, reject) {
        let filePath = path.join(dir, file);
        fs.lstat(filePath, function(err, stats) {
            if (err) {
                return reject(err);
            }
            if (stats.isDirectory()) {
                resolve(deleteDirectory(filePath));
            } else {
                fs.unlink(filePath, function(err) {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            }
        });
    });
};

function deleteDirectory(dir) {
    return new Promise(function(resolve, reject) {
        fs.access(dir, (err) => {
            if (err) {
                return reject(err);
            }
            fs.readdir(dir, function(err, files) {
                if (err) {
                    return reject(err);
                }
                Promise.all(files.map(function(file) {
                    return deleteFile(dir, file);
                })).then(() => {
                    fs.rmdir(dir, function(err) {
                        if (err) {
                            return reject(err);
                        }
                        resolve();
                    });
                }).catch(reject);
            });
        });
    });
};