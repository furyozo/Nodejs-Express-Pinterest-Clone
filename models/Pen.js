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
  },
  likes: [{
    type: ObjectId, ref: 'User'
  }],
  pins: [{
    type: ObjectId, ref: 'User'
  }]
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

  // like a pen by user
  like: function(req, callback) {
    var Pen = this;
    Pen.findById(req.params.id, function(err, pen) {
      Pen.findOne({likes: req.session.user._id}, function(err, user_liked_pen) {
        if (user_liked_pen) {
          user_liked_pen.likes.pull(req.session.user._id);
          user_liked_pen.save();
        } else {
          pen.likes.push(req.session.user._id);
          pen.save();
        }
        return callback(pen)
      })
    })
  },

  // pin pen by user
  pin: function(req, callback) {
    var Pen = this;
    Pen.findById(req.params.id, function(err, pen) {
      Pen.findOne({pins: req.session.user._id}, function(err, user_pinned_pen) {
        if (user_pinned_pen) {
          user_pinned_pen.pins.pull(req.session.user._id);
          user_pinned_pen.save();
        } else {
          pen.pins.push(req.session.user._id);
          pen.save();
        }
        return callback(pen)
      })
    })
  }

}


module.exports = mongoose.model('Pen', PenSchema);
