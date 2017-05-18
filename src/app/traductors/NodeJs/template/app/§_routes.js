module.exports = function(app){
<§- data -> model -§>
	var <§ model.name §>s = require('./controllers/<§ model.name §>s');
	app.get('/<§ model.name §>s', <§ model.name §>s.findAll);
	app.get('/<§ model.name §>s/:id', <§ model.name §>s.findById);
	app.post('/<§ model.name §>s', <§ model.name §>s.add);
	app.put('/<§ model.name §>s/:id', <§ model.name §>s.update);
	app.delete('/<§ model.name §>s/:id', <§ model.name §>s.delete);
	
<-§->
}