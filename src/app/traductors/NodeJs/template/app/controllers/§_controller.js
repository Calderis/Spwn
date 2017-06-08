var mongoose = require('mongoose'),
<§ data.className §> = mongoose.model('<§ data.className §>');

exports.findAll = function(req, res){
  <§ data.className §>.find({},function(err, results) {
    return res.send(results);
  });
};
exports.findById = function(req, res){
  var id = req.params.id;
  <§ data.className §>.findOne({'_id':id},function(err, result) {
    return res.send(result);
  });
};
exports.add = function(req, res) {
  <§ data.className §>.create(req.body, function (err, <§ data.name §>) {
    if (err) return console.log(err);
    return res.send(<§ data.name §>);
  });
}
exports.update = function(req, res) {
  var id = req.params.id;
  var updates = req.body;

  <§ data.className §>.update({"_id":id}, req.body,
    function (err, numberAffected) {
      if (err) return console.log(err);
      console.log('Updated %d <§ data.plurialName §>', numberAffected);
      res.send(202);
    });
}
exports.delete = function(req, res){
  var id = req.params.id;
  <§ data.className §>.remove({'_id':id},function(result) {
    return res.send(result);
  });
};