import { Injectable } from '@angular/core';
import * as electron from 'electron';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {

	public path = path;

  constructor() { }

  public ensureDirectoryExistence(filePath): boolean {
		if (fs.existsSync(filePath)) {
			return true;
		}
		fs.mkdirSync(filePath);
		return true;
	}

	public listFiles(dirname): void {
		console.log('—————————— LIST FILES ——————————');
		console.log(dirname);
		fs.readdir(path.resolve(dirname), (err, files) => {
			files.forEach((file) => {
				console.log(file);
			});
			console.log('—————————— LIST FILES ——————————');
		});
	}

	public copyFileSync( source, target ): void {

	    let targetFile = target;

	    //if target is a directory a new file with the same name will be created
	    if ( fs.existsSync( target ) ) {
	        if ( fs.lstatSync( target ).isDirectory() ) {
	            targetFile = path.join( target, path.basename( source ) );
	        }
	    }

	    fs.writeFileSync(targetFile, fs.readFileSync(source));
	}

	public copyFolderRecursiveSync( source, target ): void {
	    let files = [];

	    //check if folder needs to be created or integrated
	    let targetFolder = path.join( target, path.basename( source ) );
	    if ( !fs.existsSync( targetFolder ) ) {
	        fs.mkdirSync( targetFolder );
	    }

	    //copy
	    if ( fs.lstatSync( source ).isDirectory() ) {
	        files = fs.readdirSync( source );
	        files.forEach( ( file ) => {
	            let curSource = path.join( source, file );
	            if ( fs.lstatSync( curSource ).isDirectory() ) {
	                this.copyFolderRecursiveSync( curSource, targetFolder );
	            } else {
	                this.copyFileSync( curSource, targetFolder );
	            }
	        } );
	    }
	}

	public deleteFile(dir, file) {
	    return new Promise((resolve, reject) => {
	        let filePath = path.join(dir, file);
	        fs.lstat(filePath, (err, stats) => {
	            if (err) {
	                return reject(err);
	            }
	            if (stats.isDirectory()) {
	                resolve(this.deleteDirectory(filePath));
	            } else {
	                fs.unlink(filePath, (err) => {
	                    if (err) {
	                        return reject(err);
	                    }
	                    resolve();
	                });
	            }
	        });
	    });
	}

	public deleteDirectory(dir) {
	    return new Promise((resolve, reject) => {
	        fs.access(dir, (err) => {
	            if (err) {
	                return reject(err);
	            }
	            fs.readdir(dir, (err, files) => {
	                if (err) {
	                    return reject(err);
	                }
	                Promise.all(files.map((file) => {
	                    return this.deleteFile(dir, file);
	                })).then(() => {
	                    fs.rmdir(dir, (err) => {
	                        if (err) {
	                            return reject(err);
	                        }
	                        resolve();
	                    });
	                }).catch(reject);
	            });
	        });
	    });
	}

}
