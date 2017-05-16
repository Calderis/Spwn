import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'child-detail',
	template: `<h1>Hello from Child Detail</h1>`
})
export class ChildDetailComponent implements OnInit {

	public ngOnInit() {
		console.log('hello `ChildDetail` component');
	}

}
