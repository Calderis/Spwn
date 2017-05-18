var mongoose = require('mongoose'),
Car = mongoose.model('Car');

exports.findAll = function(req, res){
  Car.find({},function(err, results) {
    return res.send(results);
  });
};
exports.findById = function(req, res){
  var id = req.params.id;
  Car.findOne({'_id':id},function(err, result) {
    return res.send(result);
  });
};
exports.add = function(req, res) {
  Car.create(req.body, function (err, car) {
    if (err) return console.log(err);
    return res.send(car);
  });
}
exports.update = function(req, res) {
  var id = req.params.id;
  var updates = req.body;

  Car.update({"_id":id}, req.body,
    function (err, numberAffected) {
      if (err) return console.log(err);
      console.log('Updated %d cars', numberAffected);
      res.send(202);
    });
}
exports.delete = function(req, res){
  var id = req.params.id;
  Car.remove({'_id':id},function(result) {
    return res.send(result);
  });
};

exports.import = function(req, res){
  Car.create(
    { "name": "Ben", "band": "DJ Code Red", "instrument": "Reason" },
    { "name": "Mike D.","band": "Kingston Kats", "instrument": "drums" },
    { "name": "Eric", "band": "Eric", "instrument": "piano" },
    { "name": "Paul", "band": "The Eyeliner", "instrument": "guitar" }
    , function (err) {
      if (err) return console.log(err);
      return res.send(202);
    });
};