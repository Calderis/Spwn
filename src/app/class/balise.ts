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
		// 
		// Use to know if there are loop inside the loop and if yes, how many
		let loopDetected = false;
		let loopDetect = code.match(/(<§-)|(<-§->)/gm) || [];
		if(loopDetect.length) loopDetected = true;
		while(loopDetected){
			let loopNumber = 0;
			let depth = 0;
			for(let i = 1; i < loopDetect.length; i++){
				if(loopDetect[i] === '<§-') depth++;
				else depth--;
				if(depth > 0) loopNumber++;
				else break;
			}

			let loopsZone = code.match(new RegExp('^\\s*(<§-)((.*\\n)+?(\\s)*(<-§->)){' + loopNumber + '}((.*\\n)+?(\\s)*(<-§->))', 'gm')) || [];
			if(loopsZone[0] == undefined) break;

			let balise = new Balise('loop', loopsZone[0], data);
			this.childs.push(balise);
			code = code.replace(loopsZone[0], balise.content);

			loopDetect = code.match(/(<§-)|(<-§->)/gm) || [];
			if(loopDetect.length) loopDetected = true;
			else loopDetected = false;
		}

		// Detect Ifs
		// 
		// Use to know if there are if inside the loop and if yes, how many
		let ifDetected = false;
		let ifDetect = code.match(/(<§!)|(<!§!>)/gm) || [];
		if(ifDetect.length) ifDetected = true;
		while(ifDetected){
			let ifNumber = 0;
			let depth = 0;
			for(let i = 1; i < ifDetect.length; i++){
				if(ifDetect[i] === '<§!') depth++;
				else depth--;
				if(depth > 0) ifNumber++;
				else break;
			}
			let ifsZone = code.match(new RegExp('^\\s*(<§!)((.*\\n)+?(\\s)*(<!§!>)){' + ifNumber + '}((.*\\n)+?(\\s)*(<!§!>))', 'gm')) || [];
			if(ifsZone[0] == undefined) break;
			
			let balise = new Balise('if', ifsZone[0], data);
			this.childs.push(balise);
			if(balise.content == '') code = code.replace(ifsZone[0] + '\n', '');
			else code = code.replace(ifsZone[0], balise.content);
			//

			// Is there others ifs ?
			ifDetect = code.match(/(<§!)|(<!§!>)/gm) || [];
			if(ifDetect.length) ifDetected = true;
			else ifDetected = false;
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
		template[0] = template[0].replace(/\s*/g, '');
		while(template[0] == '\n' || template[0] == ''){
			template.shift();
			template[0] = template[0].replace(/\s*/g, '');
		}
		let header = template.shift();
		template.pop();
		template.pop();
		template = template.join('');

		let reference = header.match(/<§-.*->/g)[0].replace(/<§-|->|\s/g, '');
		let object = header.match(/->.*-§>/g)[0].replace(/->|-§>|\s/g, '');

		let value = this.extractValue(data, reference);
		let content = '';

		if(value.length == undefined){ // it's an object
			for(let i in value) {
				let newData = {data:data['data'], infos:data['infos'], project:data['project']};
				newData[object] = value[i];
				content += this.getContent(template, newData);
			}
		} else { // it's an array
			for(let i of value) {
				let newData = {data:data['data'], infos:data['infos'], project:data['project']};
				newData[object] = i;
				content += this.getContent(template, newData);
			}
		}

		// Indent due to Spwn tags
		content = content.replace(/^\t{1}/gm, '');

		return content;
	}

	private if(data: any): string{
		let template = this.body.match(/(.*\n*)/gm);
		template[0] = template[0].replace(/\s*/g, '');
		while(template[0] == '\n' || template[0] == ''){
			template.shift();
			template[0] = template[0].replace(/\s*/g, '');
		}
		let header = template.shift();
		template.pop();
		template.pop();
		template = template.join('');

		let reference = header.match(/<§!.*=/g)[0].replace(/<§!|=|\s|~|\!/g, '');
		let symbol = header.replace(/<§!\s+(\w*\.?)*\s?|=\s.*!§>/g, '');
		let condition = header.match(/=.*!§>/g)[0].replace(/=|!|§>|\s|~/g, '');

		let value  = this.extractValue(data, reference);

		if(condition.match(/(\"|\').*(\"|\')/g).length) { // it's a string
			condition = condition.replace(/\"|\'/g, '');
		} else { // it's an object
			condition = this.extractValue(data, condition);
		}

		let content = this.getContent(template, data);
		content = content.replace(/((\r\n|\n|\r)$)|(^(\r\n|\n|\r))|(^\s*$)/, '');

		// Indent due to Spwn tags
		content = content.replace(/^\s{4}/gm, '');

		switch(true) {
			case /~\!/.test(symbol):
				if( !(new RegExp(condition).test(value)) ) {
					return content;
				}
				break;

			case /~/.test(symbol):
				if( new RegExp(condition).test(value) ) {
					return content;
				}
				break;

			case /=\!/.test(symbol):
				if(value != condition) {
					return content;
				}
				break;

			case /=/.test(symbol):
				if(value == condition) {
					return content;
				}
				break;

			default:
				return 'SPWN - syntax error (IF) - symbole not recognized';
		}
		return '';
	}

	// Return value depending of data
	private bind(data: any): string{
		let aim = this.body.replace(/<§|§>|\s/g, '');

		let value = this.extractValue(data, aim);
		return value;
	}

	// Extract value from name and context
	public extractValue(data: any, reference: string): any{
		if(data == undefined) return '';
		let value = data;
		let aim = reference.split('.');
		for(let i = 0; i < aim.length; i++) {
			try{
				value = value[aim[i]];
			} catch(e){
				value = 'SPWN - syntax error (EXTRACT) - undefined value : ' + aim[i] + ' on ' + JSON.stringify(value);
			}
		}
		return value;
	}
}