var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require('events').EventEmitter;
var BrainswarmConstants = require("../constants/BrainswarmConstants");
var PageActions = require("../actions/PageActions");
var $ = require("jquery");
// var socket = io.connect();
var assign = require("object-assign");
// takes objects as arguements and assigns them to one large object
// similar to underscore _extend

var CHANGE_EVENT = 'change';

var _brainswarms = {};

var BrainswarmStore = assign({}, EventEmitter.prototype, {
  _brainswarms: [],

  // getAll: function() {
  //   var allBrainswarms = [];
  //   for (var key in _brainswarms){
  //     allBrainswarms.push(_brainswarms[key])
  //   }
  //   return allBrainswarms;
  // },
  getAll: function() {
    return this._brainswarms;
  },


  // getBrainswarm: function(brainswarmId) {
  // // console.log("try to get brainswarm");
  //  for (var key in _brainswarms){
  //   if (_brainswarms[key]._id === brainswarmId){
  //     return _brainswarms[key]
  //   }
  //  }
  // },
  checkBrainswarm: function(idea_id, callback){
    var brainswarms = this._brainswarms;

    for (var i =0; i < brainswarms.length; i++){
      if (brainswarms[i].idea === idea_id){
        callback(brainswarms[i]);
        break;
        // return brainswarms[i];
      }
    }
    callback();
  },
  getBrainswarm: function(idea_id, callback) {
    $.ajax({
      type: 'GET',
      url: '/brainswarms/' + idea_id,
    })
    .done(function (brainswarmsData) {
      // var brainswarms = this._brainswarms;
      for (var i = 0; i< brainswarmsData.length; i++){
        this._brainswarms.push(brainswarmsData[i]);
        if (brainswarmsData[i].idea === idea_id){
          var tempBrainswarm = brainswarmsData[i];
        }
      }

      // broadcast that _ideas has changed
      this.emitChange();
      if (tempBrainswarm) {
        console.log("callback of step2", tempBrainswarm);
        callback(tempBrainswarm);
        // return tempBrainswarm;
      }
    }.bind(this))
    .fail(function(error) {
      console.error(error);
    });
   // var brainswarms = this._brainswarms;
   // for (var i =0; i< brainswarms.length; i++){
   //    if (brainswarms[i]._id === brainswarmId){
   //      return brainswarms[i];
   //    }
   // }
  },

  findBrainswarm: function(brainswarmId) {
    var brainswarms = this._brainswarms;
    for (var i =0; i< brainswarms.length; i++){
       if (brainswarms[i]._id === brainswarmId){
         return brainswarms[i];
       }
    }
  },
  // findBrainswarm: function(idea_id) {
  //    var brainswarms = this._brainswarms;
  //    console.log("get here for brainswarms", brainswarms)
  //   // console.log("get here for brainswarms", brainswarms);
  //    for (var i =0; i< brainswarms.length; i++){
  //         console.log("these should be equal", brainswarms[i].idea, idea_id)
  //       if (brainswarms[i].idea === idea_id){
  //         return brainswarms[i];
  //       }
  //    }
  //  },

  create: function(idea_id, name) {
  //  console.log('this is create name', name);
    $.ajax({
      type: 'POST',
      url: '/brainswarms/' + idea_id,
      data: {name: name}
    })
    .done(function(brainswarm) {
      //console.log("made brainswarm",brainswarm)
       this._brainswarms.push(brainswarm);
       // _brainswarms[brainswarm._id] = brainswarm

      // broadcast that _rooms has changed
      // socket.emit('room-change', this._brainswarms);
      this.emitChange();
      PageActions.navigate({
        dest: 'brainswarms',
        props: brainswarm._id
      });
    }.bind(this))
    .fail(function(error) {
      console.log(error);
    });
  },

    // $.ajax({
        //   type: 'PUT',
        //   url: '/brainswarms/' + brainswarmId,
        //   data: {map: data},
        //   success: function(data) {
        //     console.log("worked")
        //   }
        // });

  edit: function(brainswarmId, map) {
     // console.log("i shouldnt be in edit")
     $.ajax({
       type: 'PUT',
       url: '/brainswarms/' + brainswarmId,
       data: {map: map}
     })
     .done(function(brainswarmEdit) {
         console.log('this is the edit: ', brainswarmEdit);
      // Why are we storing the data in the client and on the server??
       for (var i = 0; i < this._brainswarms.length; i++){
        if (this._brainswarms[i]._id === brainswarmEdit._id){
          this._brainswarms[i].map = brainswarmEdit.map
        }
       };
       // look through the brainswarms until finding a match
       // for id and then update the name property
       // for (var key in _brainswarms){
       //  if (_brainswarms[key]._id === brainswarmEdit._id){
       //    _brainswarms[key].map = brainswarmEdit.map;
       //    socket.emit('brainswarm-change', _brainswarms);
       //  }
       // }
       // this._brainswarms.forEach(function(brainswarm) {
       //  // Are you sure it is brainswarmEdit.id????
       //  // possibly brainswarmEdit.id
       //   if(brainswarm._id === brainswarmEdit._id) {
       //     brainswarm.map = brainswarmEdit.map;
       //     // broadcast that _brainswarms has changed
       //     // socket.emit('brainswarm-change', this._brainswarms);
       //     // return this.emitChange();
       //   }
      this.emitChange();
       // }.bind(this));
     }.bind(this))
     .fail(function(error) {
       console.error(error);
     });
  },

  visitBrainswarm: function(brainswarmId){
    PageActions.navigate({
      dest: 'brainswarms',
      props: brainswarmId
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
    case BrainswarmConstants.BRAINSWARM_CREATE:
      name = action.name.trim();

      if (name !== '') {
        BrainswarmStore.create(action.idea_id, name);
      }
      break;

    case BrainswarmConstants.BRAINSWARM_EDIT:
      BrainswarmStore.edit(action.brainswarmId, action.map);

      break;

    case BrainswarmConstants.BRAINSWARM_GET:
      BrainswarmStore.getBrainswarm(action.brainswarmId);

     break;

    case BrainswarmConstants.BRAINSWARM_VISIT:
      BrainswarmStore.visitBrainswarm(action.brainswarmId);

      BrainswarmStore.emitChange();
     break;

    default:
      return true;
  }
});

module.exports = BrainswarmStore;

