var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var <§ data.className §>Schema = new Schema({
<§- data.structure.array -> param -§>
	<§! param.type ~!= '#' !§>
		<§ param.name §>: <§ param.type §>,
	<!§!>

	<§! param.type ~= '#' !§>
		<§ param.name §>: { type: Number, ref: '<§ param.className §>' },
	<!§!>
<-§->
});

var <§ data.className §> = mongoose.model('<§ data.className §>', <§ data.className §>Schema);