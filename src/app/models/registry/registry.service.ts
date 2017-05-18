import { Injectable } from '@angular/core';
import { StorageService } from '../../storage/storage.service';

@Injectable()
export class RegistryService {

		constructor (
			private storageService: StorageService) {
		}
}
