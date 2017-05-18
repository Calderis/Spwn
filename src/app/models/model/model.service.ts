import { Injectable } from '@angular/core';
import { StorageService } from '../../storage/storage.service';

@Injectable()
export class ModelService {

		constructor (
			private storageService: StorageService) {
		}
}
