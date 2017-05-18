module.exports = function(app){
	var users = require('./controllers/users');
 	app.get('/users', users.findAll);
 	app.get('/users/:id', users.findById);
 	app.post('/users', users.add);
 	app.put('/users/:id', users.update);
 	app.delete('/users/:id', users.delete);
 	
	var cars = require('./controllers/cars');
 	app.get('/cars', cars.findAll);
 	app.get('/cars/:id', cars.findById);
 	app.post('/cars', cars.add);
 	app.put('/cars/:id', cars.update);
 	app.delete('/cars/:id', cars.delete);
 	
}