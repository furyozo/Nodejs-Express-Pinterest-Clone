var mongoose = require('mongoose')
var ObjectId = mongoose.Schema.ObjectId;
var session = require('express-session')

mongoose.connect('mongodb://prase:prase@ds255768.mlab.com:55768/pinterest-clone');

var PenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  link: {
    type: String,
    required: true,
    trim: true
  },
  user_id: {
    type: ObjectId,
    required: true
  }
});

PenSchema.statics = {

  // create a new Pen entry
  create: function(req, callback) {
    var pen = new this({
      name: req.body.name,
      link: req.body.link,
      user_id: req.session.user._id
    });
    pen.save();
    return callback();
  },

}


module.exports = mongoose.model('Pen', PenSchema);
