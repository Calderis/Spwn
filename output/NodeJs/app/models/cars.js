var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var CarSchema = new Schema({
	

 	 		owner: { type: Number, ref: 'User' },

});

var Car = mongoose.model('Car', CarSchema);