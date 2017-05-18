import { Component } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Component({})

export class Balise {

	public type: string = '';
	public body: string = '';
	public data: any = {};
	public childs: Array<Balise> = [];
	public content: string = '';


	constructor(type: string, body: string, data: any) {
		this.type = type;
		this.body = body;
		this.data = data;

		switch( this.type ) {
			default:
				this.content = this.getContent(this.body, this.data);
			break;
			case 'loop':
				this.content = this.loop(this.data);
			break;
			case 'if':
				this.content = this.if(this.data);
			break;
			case 'bind':
				this.content = this.bind(this.data);
			break;
		}
	}

	private getContent(code: string, data: any): string{

		// Detect Loops
		let loopsZone = code.match(/(<§-)(([^<§-]+?).*\n)*.*(<-§->\n)/gm) || [];
		for(let i = 0; i < loopsZone.length; i++) {
			let balise = new Balise('loop', loopsZone[i], data);
			this.childs.push(balise);

			code = code.replace(loopsZone[i], balise.content);
		}

		// Detect Ifs
		let ifsZone = code.match(/(<§\!.*\!§>)(([^<§\!]+?).*\n*)+?(\s*(<\!§\!>))/gm) || [];
		for(let i = 0; i < ifsZone.length; i++) {
			let balise = new Balise('if', ifsZone[i], data);
			this.childs.push(balise);

			code = code.replace(ifsZone[i], balise.content);
		}

		// Detect binds
		let bindsZone = code.match(/<§\s+(\w+.?)*\s+§>/gm) || [];
		for(let i = 0; i < bindsZone.length; i++) {
			let balise = new Balise('bind', bindsZone[i], data);
			this.childs.push(balise);

			code = code.replace(bindsZone[i], balise.content);
		}

		return code;
	}

	private loop(data: any): string {

		let template = this.body.match(/(.*\n*)/gm);
		let header = template.shift();
		template.pop();
		template.pop();
		template = template.join(' ');

		let reference = header.match(/<§-.*->/g)[0].replace(/<§-|->|\s/g, '');
		let object = header.match(/->.*-§>/g)[0].replace(/->|-§>|\s/g, '');
		let aim = reference.split('.');

		let value = data;
		let content = '';
		for(let i = 0; i < aim.length; i++) {
			value = value[aim[i]];
		}

		for(let i of value) {
			let newData = {};
			newData[object] = i;
			content += this.getContent(template, newData);
		}

		return content;
	}

	private if(data: any): string{

		let template = this.body.match(/(.*\n*)/gm);
		let header = template.shift();
		template.pop();
		template.pop();
		template = template.join(' ');

		let reference = header.match(/<§!.*=/g)[0].replace(/<§!|=|\s|~/g, '');
		let symbol = header.replace(/<§!\s+(\w*\.?)*\s?|=\s.*!§>/g, '');
		let condition = header.match(/=.*!§>/g)[0].replace(/=|!§>|\s|~/g, '');
		let aim = reference.split('.');

		let value = data;
		for(let i = 0; i < aim.length; i++) {
			value = value[aim[i]];
		}

		if(condition.match(/(\"|\').*(\"|\')/g).length) { // it's a string
			condition = condition.replace(/\"|\'/g, '');
		} else { // it's an object
			let val = data;
			let aim = condition.split('.');
			for(let i = 0; i < aim.length; i++) {
				val = val[aim[i]];
			}
			condition = val;
		}

		let content = this.getContent(template, data);

		switch(true) {
			case /~/.test(symbol):
				if( new RegExp(condition).test(value) ) {
					return content;
				}
				break;
			case /~\!/.test(symbol):
				if( !(new RegExp(condition).test(value)) ) {
					return content;
				}
				break;

			case /=/.test(symbol):
				if(value === condition) {
					return content;
				}
				break;
			case /=\!/.test(symbol):
				if(value !== condition) {
					return content;
				}
				break;

			default:
				break;
		}
		return '';
	}

	private bind(data: any): string{
		let aim = this.body.replace(/<§|§>|\s/g, '').split('.');
		let reference = aim.shift();

		let content = data[reference];
		for(let i = 0; i < aim.length; i++) {
			content = content[aim[i]];
		}
		return content;
	}
}

// (<§-.*\n?)((\s?<§-)(([^<§~]+?).*\n)*.*(<-§->\n))(<-§->\n)
// (<§-.*\n?)((<§-)(([^<§~]+?).*\n)*.*(<-§->\n))*.*\n*(<-§->)
// (<§-.*\n?)((<§-)(([^<§~]+?).*\n)*.*(<-§->\n))*(<-§->)
// (<§-)(([^<§~]+?).*\n)*.*(<-§->\n)
// (<§\!.*\!§>)(([^<§\!]+?).*\n*)+?(\s(<\!§\!>))