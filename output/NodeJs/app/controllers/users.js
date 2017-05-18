var mongoose = require('mongoose'),
User = mongoose.model('User');

exports.findAll = function(req, res){
  User.find({},function(err, results) {
    return res.send(results);
  });
};
exports.findById = function(req, res){
  var id = req.params.id;
  User.findOne({'_id':id},function(err, result) {
    return res.send(result);
  });
};
exports.add = function(req, res) {
  User.create(req.body, function (err, user) {
    if (err) return console.log(err);
    return res.send(user);
  });
}
exports.update = function(req, res) {
  var id = req.params.id;
  var updates = req.body;

  User.update({"_id":id}, req.body,
    function (err, numberAffected) {
      if (err) return console.log(err);
      console.log('Updated %d users', numberAffected);
      res.send(202);
    });
}
exports.delete = function(req, res){
  var id = req.params.id;
  User.remove({'_id':id},function(result) {
    return res.send(result);
  });
};

exports.import = function(req, res){
  User.create(
    { "name": "Ben", "band": "DJ Code Red", "instrument": "Reason" },
    { "name": "Mike D.","band": "Kingston Kats", "instrument": "drums" },
    { "name": "Eric", "band": "Eric", "instrument": "piano" },
    { "name": "Paul", "band": "The Eyeliner", "instrument": "guitar" }
    , function (err) {
      if (err) return console.log(err);
      return res.send(202);
    });
};