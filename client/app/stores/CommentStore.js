var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require('events').EventEmitter;
var CommentConstants = require("../constants/CommentConstants");
var PageConstants = require("../constants/PageConstants");
var PageStore = require("./PageStore");
var $ = require("jquery");
var _ = require("underscore");
// var socket = io.connect();
var assign = require("object-assign");

var CHANGE_EVENT = 'change';

var CommentStore = assign({}, EventEmitter.prototype, {
  _comments: [],

  _room: function() {
    return PageStore.currentRoute.props;
  },

  getAll: function (idea_id) {
    if (!idea_id) return this._comments;
    return _(this._comments).filter(function (comment) {
      return comment.idea === idea_id;
    });
  },

  //ajax requests
  //TODO: DRY out this code

  get: function (room_id) {
    $.ajax({
      type: 'GET',
      url: '/comments/' + room_id,
    })
    .done(function (comments) {
      this._comments = comments;
      // broadcast that _ideas has changed
      this.emitChange();
    }.bind(this))
    .fail(function(error) {
      console.error(error);
    });

    // socket.on('comment-change', function(currentComments) {
    //   this._comments = currentComments;
    //   // this.emitChange();
    // }.bind(this));
  },

  all: function () {
    $.ajax({
      type: 'GET',
      url: '/comments'
    })
    .done(function (comments) {
      this._comments = comments;
      this.emitChange();
    }.bind(this))
    .fail(function (error) {
      console.log(error);
    });

    // socket.on('comment-change', function(currentComments) {
    //   this._comments = currentComments;
    //   // this.emitChange();
    // }.bind(this));
  },

  create: function (idea_id, name, ownerName) {
    $.ajax({
      type: 'POST',
      url: '/comments/' + idea_id,
      data: {
        name: name,
        ownerName: ownerName
      }
    })
    .done(function (comment) {
      this._comments.push(comment);

      // broadcast that _comments has changed
      // socket.emit('comment-change', this._comments, this._room());
      this.emitChange();
    }.bind(this))
    .fail(function (error) {
      console.log(error);
    });
  },

  edit: function (_id, name, ownerName) {
    $.ajax({
      type: 'PUT',
      url: '/comments/' + _id,
      data: {
        name: name,
        ownerName: ownerName
      }
    })
    .done(function (commentEdit) {
      //find matching comment and update it
      this._comments.forEach(function (comment) {
        if (comment._id === commentEdit._id) {
          comment.name = commentEdit.name;
          comment.ownerName = commentEdit.ownerName;
        }
      }.bind(this));

      // broadcast that _comments has changed
      // socket.emit('comment-change', this._comments, this._room());
      this.emitChange();
    }.bind(this))
    .fail(function (error) {
      console.log(error);
    });
  },

  delete: function (_id) {
    $.ajax({
      type: 'DELETE',
      url: '/comments/' + _id
    })
    .done(function (oldComment) {
      //look through comments and splice out comment
      this._comments.forEach(function (comment, i) {
        if (comment._id === oldComment._id) {
          this._comments.splice(i, 1);
        }
      }.bind(this));

      // broadcast that _comments has changed
      // socket.emit('comment-change', this._comments, this._room());
      this.emitChange();
    }.bind(this))
    .fail(function (error) {
      console.log(error);
    });
  },

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

});

AppDispatcher.register(function (payload) {
  var action = payload.action;
  var _id;
  var idea_id;
  var name;
  var ownerName;

  switch (action.actionType) {
    case CommentConstants.COMMENT_GET:
      CommentStore.all();
      break;

    case CommentConstants.COMMENT_CREATE:
      idea_id = action.idea_id;
      name = action.name.trim();
      ownerName = action.ownerName;

      if (name !== '') {
        CommentStore.create(idea_id, name, ownerName);
      }
      break;

    case CommentConstants.COMMENT_EDIT:
      _id = action._id;
      name = action.name.trim();
      ownerName = action.ownerName;

      if (name !== '') {
        CommentStore.edit(_id, name, ownerName);
      }
      break;

    case CommentConstants.COMMENT_DELETE:
      _id = action._id;

      CommentStore.delete(_id);
      break;

    case PageConstants.GETROOMDATA:
      if (action.room_id){
        CommentStore.get(action.room_id);
      }
      break;

    default:
      return true;
  }

});

module.exports = CommentStore;
