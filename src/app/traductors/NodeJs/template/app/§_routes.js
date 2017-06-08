module.exports = function(app){
<§- data -> model -§>

	var <§ model.plurialName §> = require('./controllers/<§ model.plurialName §>');
	app.get('/<§ model.plurialName §>', <§ model.plurialName §>.findAll);
	app.get('/<§ model.plurialName §>/:id', <§ model.plurialName §>.findById);
	app.post('/<§ model.plurialName §>', <§ model.plurialName §>.add);
	app.put('/<§ model.plurialName §>/:id', <§ model.plurialName §>.update);
	app.delete('/<§ model.plurialName §>/:id', <§ model.plurialName §>.delete);
	
<-§->
}