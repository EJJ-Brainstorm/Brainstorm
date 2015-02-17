var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require('events').EventEmitter;
var InterestConstants = require("../constants/InterestConstants");
var PageConstants = require("../constants/PageConstants");
var PageStore = require("./PageStore");
var $ = require("jquery");
var _ = require("underscore");
// var socket = io.connect();
var assign = require("object-assign");

var CHANGE_EVENT = 'change';

var InterestStore = assign({}, EventEmitter.prototype, {
  _interests: [],

  _room: function() {
    return PageStore.currentRoute.props;
  },

  getAll: function (idea_id) {
    if (!idea_id) return this._interests;
    return _(this._interests).filter(function (interest) {
      return interest.idea === idea_id;
    });
  },

  get: function (room_id) {
    $.ajax({
      type: 'GET',
      url: '/interest/' + room_id,
    })
    .done(function (interests) {
      this._interests = interests;
      // broadcast that _ideas has changed
      this.emitChange();
    }.bind(this))
    .fail(function(error) {
      console.error(error);
    });

    // socket.on('interest-change', function(currentInterests) {
    //   this._interests = currentInterests;
    //   // this.emitChange();
    // }.bind(this));
  },

  create: function(idea_id) {
    $.ajax({
      type: 'POST',
      url: '/interest/' + idea_id
    })
    .done(function(interest) {
      this._interests.push(interest);

      // broadcast that _interests has changed
    //   socket.emit('interest-change', this._interests, this._room());
      this.emitChange();
    }.bind(this))
    .fail(function(error) {
      console.log(error);
    });
  },

  delete: function (_id) {
    $.ajax({
      type: 'DELETE',
      url: '/interest/' + _id
    })
    .done(function (oldInterest) {
      //look through comments and splice out comment
      this._interests.forEach(function (interest, i) {
        if (interest._id === oldInterest._id) {
          this._interests.splice(i, 1);
        }
      }.bind(this));

      // broadcast that _comments has changed
    //   socket.emit('interest-change', this._interests, this._room());
      this.emitChange();
    }.bind(this))
    .fail(function (error) {
      console.log(error);
    });
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

AppDispatcher.register(function(payload) {
  var action = payload.action;
  var idea_id = action.idea_id;
  var _id;

  switch(action.actionType) {
    case InterestConstants.INTEREST_GET:
      InterestStore.all();
      break;

    case InterestConstants.INTEREST_CREATE:
      idea_id = action.idea_id;

      InterestStore.create(idea_id);
      break;

    case InterestConstants.INTEREST_DELETE:
      _id = action._id;

      InterestStore.delete(_id);
      break;

    case PageConstants.GETROOMDATA:
      if (action.room_id){
        InterestStore.get(action.room_id);
      }
      break;

    default:
      return true;
  }
});

module.exports = InterestStore;
