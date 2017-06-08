import { Injectable, Pipe } from '@angular/core';

@Pipe({
   name: 'keyobject'
})
@Injectable()
export class Keyobject {

	transform(value):any {
	    let keys = [];
	    for (let key in value) {
	        keys.push(value[key]);
	    }
	    return keys;
	}
}