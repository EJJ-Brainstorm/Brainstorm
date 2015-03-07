var Reflux = require("reflux");
var BrainswarmActions = require("../actions/BrainswarmActions");
var socket = io.connect();

var BrainswarmStore = Reflux.createStore({

  listenables: BrainswarmActions,

  getBrainswarm: function(idea_id, callback) {
    $.ajax({
      type: 'GET',
      url: '/brainswarms/' + idea_id
    })
      .done(function (brainswarmsData) {

        this.trigger();
        if (brainswarmsData) {
          return callback(brainswarmsData[0]);
        };
        callback();
      }.bind(this))
      .fail(function(error) {
        console.error(error);
      });

  },

  getBrainswarmById: function(brainswarm_id, callback) {
    // This ajax call sends the brainswarm_id as an "idea_id" to the routes
    $.ajax({
      type: "GET",
      url: "/brainswarms/" + brainswarm_id
    })
      .done(function(brainswarmData){

        this.trigger();
        callback(brainswarmData[0]);
      }.bind(this))
      .fail(function(error) {
        console.error(error);
      });
  },

  create: function(idea_id, name, callback) {
    $.ajax({
      type: 'POST',
      url: '/brainswarms/' + idea_id,
      data: {name: name}
    })
      .done(function(brainswarm) {

        this.trigger();
        callback(brainswarm._id);
      }.bind(this))
      .fail(function(error) {
        console.log(error);
      });
  },


  edit: function(brainswarmId, map) {
    $.ajax({
      type: 'PUT',
      url: '/brainswarms/' + brainswarmId,
      data: {map: map}
    })
      .done(function(brainswarmEdit) {

        this.trigger();
      }.bind(this))
      .fail(function(error) {
        console.log(error);
      });
  }

});

module.exports = BrainswarmStore;
