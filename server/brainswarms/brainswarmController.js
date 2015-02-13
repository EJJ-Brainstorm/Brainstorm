var Brainswarm = require('./brainswarm.server.model.js');
var Q = require('q');

module.exports = {

  newBrainswarm: function(req, res, next) {
    console.log("brainswarm post");
    var brainswarm = {};

    //console.log('this is req: ',req);
    brainswarm.name = req.body.name;
    // need to send idea in ajax request within brainswarm store
    brainswarm.idea = req.params.idea_id;
   // console.log(req);
    console.log(brainswarm);
    // Possibly take out user information.
    brainswarm.ownerName = req.user.socialData.name;
    brainswarm.owner = req.user._id;

    // create a promise for Brainswarm.create method
    var createBrainswarm = Q.nbind(Brainswarm.create, Brainswarm);

    // attempt to create the brainswarm
    createBrainswarm(brainswarm)
      .then(function (createdBrainswarm) {
        // if the brainswarm is created send it back
        if (createdBrainswarm) {
          res.json(createdBrainswarm);
        }
      })
      .fail(function (error) {
        console.log("failed to create brainswarm");
        next(error);
      });
  },

    updateBrainswarm: function(req, res, next) {
      //we convert the request objects into strings just to be safe(req.user._id was coming back as an object for some reason)
      var user = String(req.user._id);
      var ideaOwner = String(req.body.owner);

      //We want all to be able to save changes to brainswarm

      // create promise for Idea.findById
      var findBrainswarmById = Q.nbind(Brainswarm.findById, Brainswarm);

      // attempt to find the idea by the id passed in
      findBrainswarmById(req.params.brainswarm_id)
        .then(function(foundBrain) {
          // if the brainswarm is found update the name and save
          if (foundBrain) {
            foundBrain.map = req.body.map;
            //add more to update dont know what
            foundBrain.save(function(err) {
              if (err) {
                res.send(err);
              }
              res.json(foundBrain);
            });
          }
        })
        .fail(function(error) {
          next(error);
        });
    }

};


