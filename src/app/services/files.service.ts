import { Injectable } from '@angular/core';
import * as electron from 'electron';
import * as fs from 'fs';
import * as url from 'url';
import * as http from 'http';
import { spawn } from 'child_process';
import * as path from 'path';
import * as archiver from 'archiver';

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

	public deleteFolderRecursive(dir): void {
	  if( fs.existsSync(dir) ) {
	    fs.readdirSync(dir).forEach((file,index) => {
	      var curPath = dir + "/" + file;
	      if(fs.lstatSync(curPath).isDirectory()) { // recurse
	        this.deleteFolderRecursive(curPath);
	      } else { // delete file
	        fs.unlinkSync(curPath);
	      }
	    });
	    fs.rmdirSync(dir);
	  }
	};

	public deleteFile(dir, file): Promise<{}> {
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

	// Create Archive .zip froms files
	// content: {
	// 	files: [],
	// 	folders: []
	// }
	// Return path to Zip file
	public createArchive(name: string, content: any, next: any){
		console.log('Create archive', name, content);
		let dirname = path.resolve(electron.remote.app.getPath('userData') + '/files/');
		var output = fs.createWriteStream(dirname + '/' + name + '.zip');
		var archive = archiver('zip', {
		    zlib: { level: 9 } // Sets the compression level.
		});

		// listen for all archive data to be written
		output.on('close', function() {
		  console.log(archive.pointer() + ' total bytes');
		  console.log('archiver has been finalized and the output file descriptor has closed.');
		  next(dirname + '/' + name + '.zip');
		});

		// good practice to catch this error explicitly
		archive.on('error', function(err) {
			console.log(err);
		  throw err;
		});

		// pipe archive data to the file
		archive.pipe(output);

		for(var i = 0; i < content.files.length; i++){
			archive.file(content.files[i].path, { name: content.files[i].name });
		}
		for(var i = 0; i < content.folders.length; i++){
			archive.directory(content.folders[i].path + '/', content.folders[i].name);
		}

		// finalize the archive (ie we are done appending files but streams have to finish yet)
		archive.finalize();
	}

	public download(file_url: string, output: string, next: any){
		output =  path.resolve(electron.remote.app.getPath('userData') + output) + '/';
		this.ensureDirectoryExistence(output);
		
		var options = {
		    host: '151.80.141.50',
		    port: 4040,
		    path: url.parse(file_url).pathname
		};

		var file_name = url.parse(file_url).pathname.split('/').pop() + '.zip';
		var file = fs.createWriteStream(output + file_name);

		http.get(options, function(res) {
	    	res.on('data', function(data) {
	            file.write(data);
	        }).on('end', function() {
	            file.end();
	            next(output);
	        });
	    });
	}

}
