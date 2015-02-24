var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require('events').EventEmitter;
var PageConstants = require("../constants/PageConstants");
var assign = require("object-assign");
var page = require("page");

var CHANGE_EVENT = 'change';

var PageStore = assign({}, EventEmitter.prototype, {

  //define routes for PageStore
  routes: {

    welcome: function () {
      return '/welcome';
    },

    //rooms route needs the roomId to route to
    rooms: function (roomId) {
      return '/rooms/'+roomId;
    },

    brainswarms: function (brainswarmId) {
      return '/brainswarms/'+brainswarmId
    },

    about: function(){
      return '/about';
    }

  },

  //dispatch event to render welcome
  welcome: function () {
    this.emitChange('welcome');
  },

  about: function () {
    this.emitChange('about');
  },

  //dispatch event to render rooms
  rooms: function (roomId) {
    this.emitChange('room', roomId);
  },

  brainswarms: function (brainswarmId) {
    this.emitChange('brainswarm', brainswarmId)
  },

  emitChange: function(){
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
  var body;

  //listen for navigate action
  switch (action.actionType) {
    case PageConstants.NAVIGATE:

      //get destination and properties from action
      body = action.body;

      //set currentRoute in store for views to access
      PageStore.currentRoute = body;

      //route application
      page(PageStore.routes[body.dest](body.props));
      // PageStore.emitChange();
      break;

    default:
      return true;
  }

});

//page options
page({

  //prefix urls with #!
  hashbang: true,

  popstate: true,
  //prevent page dispatching
  dispatch: false
});

//on welcome route: call welcome route
page('/welcome', function(){
  PageStore.welcome();
});

//on rooms route: call rooms route and pass it room id
page('/rooms/:roomId', function(ctx){
  PageStore.rooms(ctx.params.roomId);
});

page('/brainswarms/:brainswarmId', function(ctx) {
 // console.log('this is ctx', ctx);
  PageStore.brainswarms(ctx.params.brainswarmId)
});

page('/about', function(){
  PageStore.about();
});

module.exports = PageStore;
