// var socket = io.connect();
var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require('events').EventEmitter;
var RoomConstants = require("../constants/RoomConstants");
var PageActions = require("../actions/PageActions");
var assign = require("object-assign");
var $ = require("jquery");

var CHANGE_EVENT = 'change';

var RoomStore = assign({}, EventEmitter.prototype, {
  _rooms: [],

  getAll: function() {
    return this._rooms;
  },

  all: function() {
    $.ajax({
      type: 'GET',
      url: '/rooms'
    })
    .done(function(rooms) {
      console.log(rooms)
      this._rooms = rooms;
      this.emitChange();
    }.bind(this))
    .fail(function(error) {
      console.log(error);
    });

    // socket.on('room-change', function(currentRooms) {
    //   this._rooms = currentRooms;
    //   // this.emitChange();
    // }.bind(this));
  },

  create: function(name) {
    $.ajax({
      type: 'POST',
      url: '/rooms',
      data: {name: name}
    })
    .done(function(room) {
      console.log(room)
      this._rooms.push(room);

      // broadcast that _rooms has changed
      // socket.emit('room-change', this._rooms);
      this.emitChange();

      PageActions.navigate({
        dest: 'rooms',
        props: room._id
      });
    }.bind(this))
    .fail(function(error) {
      console.log(error);
    });
  },

  edit: function(room) {
    // console.log("i shouldnt be in edit")
    $.ajax({
      type: 'PUT',
      url: '/rooms/' + room.id,
      data: room
    })
    .done(function(roomEdit) {
      // look through the rooms until finding a match
      // for id and then update the name property
      this._rooms.forEach(function(room) {
        if(room._id === roomEdit._id) {
          room.name = roomEdit.name;
          // broadcast that _rooms has changed
          // socket.emit('room-change', this._rooms);
          // return this.emitChange();
        }
      }.bind(this));
      this.emitChange();
    }.bind(this))
    .fail(function(error) {
      console.error(error);
    });
  },

  delete: function(room) {
    $.ajax({
      type: 'DELETE',
      url: '/rooms/' + room.id,
      data: room
    })
    .done(function(oldId) {
      // find deleted room by oldId in _rooms and remove
      this._rooms.forEach(function(room, index) {
        if(room._id === oldId._id) {
          this._rooms.splice(index, 1);

          // broadcast that _rooms has changed
          // socket.emit('room-change', this._rooms);
          // return this.emitChange();
        }
      }.bind(this));
      this.emitChange();
    }.bind(this))
    .fail(function(error) {
      console.error(error);
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
  var name;

  switch(action.actionType) {
    case RoomConstants.ROOM_CREATE:
      name = action.name.trim();

      if (name !== '') {
        RoomStore.create(name);
      }
      break;
    case RoomConstants.ROOM_EDIT:
      if(action.room.name !== '') {
        RoomStore.edit(action.room);
      }
      break;
    case RoomConstants.ROOM_DELETE:
      if(action.room.id !== '') {
        RoomStore.delete(action.room);
      }
      break;

    default:
      return true;
  }
});

module.exports = RoomStore;
