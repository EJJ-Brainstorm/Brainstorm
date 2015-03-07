var Reflux = require("reflux");
var IdeaActions = require("../actions/IdeaActions");
var socket = io.connect();



var IdeaStore = Reflux.createStore({

  listenables: IdeaActions,

  init: function() {
    this.socketListener();
  },

  _ideas: [],

  _room: '',

  setRoom: function(currentRoom) {
    this._room = currentRoom;
  },

  getAll: function() {
    return this._ideas;
  },

  socketListener: function() {
    socket.on('idea-change', function(currentIdeas) {
      this._ideas = currentIdeas;
      this.trigger();
    }.bind(this));
  },

  get: function(room_id) {
    $.ajax({
      type: 'GET',
      url: '/ideas/' + room_id
    })
    .done(function (ideas) {
      this._ideas = ideas;
      // broadcast that _ideas has changed
      this.trigger();
    }.bind(this))
    .fail(function(error) {
      console.error(error);
    });
  },

  all: function() {
    $.ajax({
      type: 'GET',
      url: '/ideas'
    })
    .done(function (ideas) {
      this._ideas = ideas;
      // broadcast that _ideas has changed
      this.trigger();
    }.bind(this))
    .fail(function(error) {
      console.error(error);
    });
  },

  create: function(room_id, name) {
    $.ajax({
      type: 'POST',
      url: '/ideas/' + room_id,
      data: {name: name}
    })
    .done(function (idea) {
      this._ideas.push(idea);
      // broadcast that _ideas has changed
      socket.emit('idea-change', this._ideas, room_id);
      this.trigger();
    }.bind(this))
    .fail(function(error) {
      console.error(error);
    });
  },

  edit: function(idea) {
    $.ajax({
      type: 'PUT',
      url: '/ideas/' + idea.id,
      data: idea
    })
    .done(function(ideaEdit) {
      // look through the ideas until finding a match
      // for id and then update the name property
      this._ideas.forEach(function(idea) {
        if(idea._id === ideaEdit._id) {
          idea.name = ideaEdit.name;
          idea.position = ideaEdit.position;

          // broadcast that _ideas has changed
          socket.emit('idea-change', this._ideas, this._room);
          // return this.emitChange();
        }
      }.bind(this));
      this.trigger();
    }.bind(this))
    .fail(function(error) {
      console.error(error);
    });
  },

  delete: function(idea) {
    $.ajax({
      type: 'DELETE',
      url: '/ideas/' + idea.id,
      data: idea
    })
    .done(function(oldId) {
      // find deleted idea by oldId in _ideas and remove
      this._ideas.forEach(function(idea, index) {
        if(idea._id === oldId._id) {
          this._ideas.splice(index, 1);

          // broadcast that _ideas has changed
          socket.emit('idea-change', this._ideas, this._room);
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



module.exports = IdeaStore;
