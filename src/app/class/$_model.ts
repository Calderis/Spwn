<§- data.array -> param -§>
	<§! param.type.className == 'Array' !§>
		import { <§ param.class.className §> } from './<§ param.class.name §>';
	<!§!>
	<§! param.type.className == 'Object' !§>
		import { <§ param.class.className §> } from './<§ param.class.name §>';
	<!§!>
<-§->

export class <§ data.className §> {
	public id: string = '';
	<§- data.array -> param -§>
		<§! param.type.className == 'String' !§>
			public <§ param.name §>: <§ param.type.name §> = '';
		<!§!>
		<§! param.type.className == 'Number' !§>
			public <§ param.name §>: <§ param.type.name §>;
		<!§!>
		<§! param.type.className == 'Boolean' !§>
			public <§ param.name §>: <§ param.type.name §>;
		<!§!>
		<§! param.type.className == 'Array' !§>
			public <§ param.name §>: Array<<§ param.class.className §>> = [];
		<!§!>
		<§! param.type.className == 'Object' !§>
			public <§ param.name §>: <§ param.type.name §>;
		<!§!>
  	<-§->
	constructor() {
	}

	// ————— EXPORT
	public toJson() {
		let json = {
			<§- data.array -> param -§>
				<§! param.type.className =!= 'Object' !§>
					<§! param.type.className =!= 'Array' !§>
						<§ param.name §> : this.<§ param.name §>,
					<!§!>
				<!§!>
		    	<§! param.type.className == 'Object' !§>
					<§ param.name §> : this.<§ param.name §>.toJson(),
				<!§!>
				<§! param.type.className == 'Array' !§>
					<§ param.name §> : [],
				<!§!>
		  	<-§->
		};
		<§- data.array -> param -§>
			<§! param.type.className == 'Array' !§>
				for(var i = 0; i < this.<§ param.name §>.length; i++){
					json.<§ param.name §>.push(this.<§ param.name §>[i].toJson());
				}
			<!§!>
	  	<-§->
		return json;
	}
	public toObject(json: Object) {
		this.id = json["_id"];
		<§- data.array -> param -§>
			<§! param.type.className =!= 'Object' !§>
				<§! param.type.className =!= 'Array' !§>
					this.<§ param.name §> = json["<§ param.name §>"];
				<!§!>
			<!§!>
	    	<§! param.type.className == 'Object' !§>
		    	let <§ param.name §> = new <§ param.class.className §>();
		    	<§ param.name §>.toObject(json["<§ param.name §>"]);
				this.<§ param.name §> = <§ param.name §>;
			<!§!>
			<§! param.type.className == 'Array' !§>
				this.<§ param.name §> = [];
				for(var i = 0; i < json["<§ param.name §>"].length; i++){
					let <§ param.class.name §> = new <§ param.class.className §>();
					<§ param.class.name §>.toObject(json["<§ param.name §>"][i]);
					this.<§ param.name §>.push(<§ param.class.name §>);
				}
			<!§!>
	  	<-§->
	}
}
