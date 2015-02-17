var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require('events').EventEmitter;
var FilterConstants = require("../constants/FilterConstants");
var assign = require("object-assign");

var CHANGE_EVENT = 'change';

var FilterStore = assign({}, EventEmitter.prototype, {

  _filtered:[],

  filter: function(id){



  unfilter: function(id){
    if (this._filtered.indexOf(id)){
      console.log('ID FOUND IN FILTERED LIST');

      var index = this._filtered.indexOf(id);
      this._filtered.splice(index, 1);

    }
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
  var name;

  switch (action.actionType) {

    case FilerConstants.FILTER_NAME:
      id = action.id.trim();

      this._filtered.push(id);
      console.log("PUSHED TO FILTERED STORE ARRAY", id);

      // if (name !== '') {
      //   app.CommentStore.create(action.room_id, name);
      // }
      FilterStore.emitChange();
      break;

    case FilerConstants.UNFILTER_NAME:

      FilterStore.filter(action.)
      FilterStore.emitChange();
      break;

    default:
      return true;
  }
});

module.exports = FilterStore;
