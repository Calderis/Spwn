var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var <§ data.className §>Schema = new Schema({
<§- data.array -> param -§>
	<§! param.type == 'Object' !§>
		<§ param.name §>: { type: Number, ref: '<§ param.className §>' },
	<!§!>
	<§! param.type == 'String' !§>
		<§ param.name §>: <§ param.type §>,
	<!§!>
	<§! param.type == 'Number' !§>
		<§ param.name §>: <§ param.type §>,
	<!§!>
<-§->
});

var <§ data.className §> = mongoose.model('<§ data.className §>', <§ data.className §>Schema);