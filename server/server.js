'use strict';

var express = require('express');
var mongoose = require('./db.js');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var brainswarmController = require('./brainswarms/brainswarmController');



io.on('connection', function(client) {

  client.on('join', function(room) {
    if (client.brainswarm){
      client.leave(client.brainswarm);
    }
    client.room = room;
    client.join(room);
  });


  client.on('comment-change', function(currentComments, room) {
    client.broadcast.in(room).emit('comment-change', currentComments);
  });

  client.on('idea-change', function(currentIdeas, room) {
    client.broadcast.in(room).emit('idea-change', currentIdeas);
  });

  client.on('interest-change', function(currentInterests, room) {
    client.broadcast.in(room).emit('interest-change', currentInterests);
  });

  client.on('room-change', function(currentRooms) {
    client.broadcast.emit('room-change', currentRooms);
  });


  client.on('join brainswarm', function(brainswarm) {
    client.brainswarm = brainswarm;
    client.join(brainswarm);
  });

  client.on('brainswarm change', function(currentBrainswarms) {
    client.leave(currentBrainswarms);
  });

  client.on('brainswarm leave', function(currentBrainswarms) {
    client.leave(currentBrainswarms);
  });

  client.on('map change', function(editMap){

    if(editMap.toSave){
      brainswarmController.updateBrainswarm(client.brainswarm, editMap.mapData);
    }
    client.broadcast.to(client.brainswarm).emit('edit map', editMap.mapData);
  });

  client.on('join ideaRoom', function(ideaRoom) {
    client.ideaRoom = ideaRoom;
    client.join(ideaRoom);
  });

  client.on('leave ideaRoom', function(ideaRoom) {
    client.leave(ideaRoom);
  });

  client.on('idea change', function(obj){
    client.broadcast.to(client.ideaRoom).emit('edit location', obj);
  });

});

require('./config/middleware')(app, express);

module.exports = server;
