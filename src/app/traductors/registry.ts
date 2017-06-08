import { NodeJs } from './NodeJs/nodejs';
import { Yarn } from './Yarn/yarn';

export class Registry {
	public languages: any = [
		new NodeJs(),
		new Yarn()
	];

	constructor() {
		return this.languages;
	}
}
