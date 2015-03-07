var Reflux = require("reflux");
var socket = io.connect();
var RoomActions = require("../actions/RoomActions");


var RoomStore = Reflux.createStore({

  listenables: RoomActions,

  init: function() {
    this.socketListener();
  },

  _rooms: [],

  getAll: function() {
    return this._rooms;
  },

  socketListener: function() {
    socket.on('room-change', function(currentRooms) {
      this._rooms = currentRooms;
      this.trigger();
    }.bind(this));
  },

  all: function() {
    $.ajax({
      type: 'GET',
      url: '/rooms'
    })
    .done(function(rooms) {
      this._rooms = rooms;
      this.trigger();
    }.bind(this))
    .fail(function(error) {
      console.log(error);
    });
  },

  create: function(name, callback) {
    $.ajax({
      type: 'POST',
      url: '/rooms',
      data: {name: name}
    })
    .done(function(room) {
      this._rooms.push(room);

      // broadcast that _rooms has changed
      socket.emit('room-change', this._rooms);
      this.trigger();
      callback(room._id);
    }.bind(this))
    .fail(function(error) {
      console.log(error);
    });
  },

  edit: function(room) {
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
          socket.emit('room-change', this._rooms);
          // return this.emitChange();
        }
      }.bind(this));
    this.trigger();
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
          socket.emit('room-change', this._rooms);
          // return this.emitChange();
        }
      }.bind(this));
      this.trigger();
    }.bind(this))
    .fail(function(error) {
      console.error(error);
    });
  }
});


module.exports = RoomStore;
