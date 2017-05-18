import { Injectable } from '@angular/core';
import { StorageService } from '../../storage/storage.service';

@Injectable()
export class FileService {

	constructor (
		private storageService: StorageService) {
	}
}
