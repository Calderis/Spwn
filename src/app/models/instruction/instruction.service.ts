import { Injectable } from '@angular/core';
import { StorageService } from '../../storage/storage.service';

@Injectable()
export class InstructionService {

		constructor (
			private storageService: StorageService) {
		}
}
