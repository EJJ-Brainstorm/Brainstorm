var Brainswarm = require('./brainswarm.server.model.js');
var Q = require('q');

module.exports = {

  newBrainswarm: function(req, res, next) {

    var brainswarm = {};
    console.log("not suppose to be HERE")
    //console.log('this is req: ',req);
    brainswarm.name = req.body.name;
    // need to send idea in ajax request within brainswarm store
    brainswarm.idea = req.params.idea_id;

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
      console.log("HERE");
      // attempt to find the idea by the id passed in
      findBrainswarmById(req.params.brainswarm_id)
        .then(function(foundBrain) {
          // if the brainswarm is found update the name and save
          if (foundBrain) {
            console.log("HEREEEEEE")
            foundBrain.map = req.body.map;
            console.log("map", req.body.map);
            console.log("req.body", req.body);
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
    },

    getBrainswarm: function(req, res, next){
      var getBrainswarm = Q.nbind(Brainswarm.find, Brainswarm);
      var query = req.params.idea_id ? { idea: req.params.idea_id } : {};
      console.log("Look at this QUERY", query)
      getBrainswarm(query)
        .then(function(allBrainswarms) {
        // if there are brainswarm send them in response
        if(allBrainswarms) {
          res.json(allBrainswarms);
        }
      })
      .fail(function(error) {
        next(error);
      });
    }

};


