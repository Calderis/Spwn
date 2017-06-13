import { Component, OnInit, Input } from '@angular/core';

import { User } from '../../class/user';

@Component({
  selector: 'content',
  providers: [],
  styleUrls: [ './content.component.scss' ],
  templateUrl: './content.component.html'
})
export class ContentComponent implements OnInit {

	@Input() session: any;

	constructor() {
	}

	ngOnInit() {
	}
}