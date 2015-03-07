var Reflux = require("reflux");
var _ = require("underscore");
var socket = io.connect();
var InterestActions = require("../actions/InterestActions");

var InterestStore = Reflux.createStore({

  listenables: InterestActions,

  init: function() {
    this.socketListener();
  },

  _interests: [],

  _room: "",

  setRoom: function(currentRoom) {
    this._room = currentRoom;
  },

  getAll: function(idea_id) {
    if (!idea_id) return this._interests;
    return _(this._interests).filter(function (interest) {
      return interest.idea === idea_id;
    });
  },

  socketListener: function() {
    socket.on('interest-change', function(currentInterests) {
      this._interests = currentInterests;
      this.trigger();
    }.bind(this));
  },

  get: function(room_id) {
    $.ajax({
      type: 'GET',
      url: '/interest/' + room_id,
    })
    .done(function(interests) {
      this._interests = interests;
      // broadcast that _ideas has changed
      this.trigger();
    }.bind(this))
    .fail(function(error) {
      console.error(error);
    });
  },

  create: function(idea_id) {
    $.ajax({
      type: 'POST',
      url: '/interest/' + idea_id
    })
    .done(function(interest) {
      this._interests.push(interest);

      // broadcast that _interests has changed
      this.trigger();
      socket.emit('interest-change', this._interests, this._room);
    }.bind(this))
    .fail(function(error) {
      console.log(error);
    });
  },

  delete: function(_id) {
    $.ajax({
      type: 'DELETE',
      url: '/interest/' + _id
    })
    .done(function(oldInterest) {
      //look through comments and splice out comment
      this._interests.forEach(function (interest, i) {
        if (interest._id === oldInterest._id) {
          this._interests.splice(i, 1);
        }
      }.bind(this));

      // broadcast that _comments has changed
      this.trigger();
      socket.emit('interest-change', this._interests, this._room);
    }.bind(this))
    .fail(function (error) {
      console.log(error);
    });
  }
});


module.exports = InterestStore;
