var Reflux = require("reflux");
var _ = require("underscore");
var socket = io.connect();
var CommentActions = require("../actions/CommentActions");

var CommentStore = Reflux.createStore({

  listenables: CommentActions,

  init: function() {
    this.socketListener();
  },

  _comments: [],

  _room: "",

  setRoom: function(currentRoom) {
    this._room = currentRoom;
  },

  getAll: function(idea_id) {
    if (!idea_id) return this._comments;
    return _(this._comments).filter(function (comment) {
      return comment.idea === idea_id;
    });
  },

  socketListener: function() {
    socket.on('comment-change', function(currentComments) {
      this._comments = currentComments;
      this.trigger();
    }.bind(this));
  },

  //ajax requests
  //TODO: DRY out this code

  get: function(room_id) {
    $.ajax({
      type: 'GET',
      url: '/comments/' + room_id
    })
    .done(function(comments) {
      this._comments = comments;
      // broadcast that _ideas has changed
      this.trigger();
    }.bind(this))
    .fail(function(error) {
      console.error(error);
    });
  },

  create: function(idea_id, name) {
    var urlBoolean = false;
    if (name.toString().slice(0,7) === "http://" || name.toString().slice(0,8) === "https://"){
        urlBoolean = true;
      }
    $.ajax({
      type: 'POST',
      url: '/comments/' + idea_id,
      data: {
        name: name,
        urlBoolean: urlBoolean
      }
    })
    .done(function(comment) {
      this._comments.push(comment);
      this.trigger();
      // broadcast that _comments has changed
      socket.emit('comment-change', this._comments, this._room);
    }.bind(this))
    .fail(function (error) {
      console.log(error);
    });
  },

  edit: function(_id, name) {
    $.ajax({
      type: 'PUT',
      url: '/comments/' + _id,
      data: {
        name: name
      }
    })
    .done(function(commentEdit) {
      //find matching comment and update it
      this._comments.forEach(function (comment) {
        if (comment._id === commentEdit._id) {
          comment.name = commentEdit.name;
        }
      }.bind(this));
      this.trigger();
      // broadcast that _comments has changed
      socket.emit('comment-change', this._comments, this._room);
    }.bind(this))
    .fail(function (error) {
      console.log(error);
    });
  },

  delete: function(_id) {
    $.ajax({
      type: 'DELETE',
      url: '/comments/' + _id
    })
    .done(function(oldComment) {
      //look through comments and splice out comment
      this._comments.forEach(function (comment, i) {
        if (comment._id === oldComment._id) {
          this._comments.splice(i, 1);
        }
      }.bind(this));
      this.trigger();
      // broadcast that _comments has changed
      socket.emit('comment-change', this._comments, this._room);
    }.bind(this))
    .fail(function (error) {
      console.log(error);
    });
  }

});

module.exports = CommentStore;
