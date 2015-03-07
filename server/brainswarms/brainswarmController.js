var Brainswarm = require('./brainswarm.server.model.js');
var Q = require('q');

module.exports = {

  newBrainswarm: function(req, res, next) {

    var brainswarm = {};
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

      //We want all to be able to save changes to brainswarm
      var query;
      if (req.params) {
        query = req.params.brainswarm_id;
      } else {
        // req in this case would be the brainswarm Id
        query = req;
      }
      // create promise for Idea.findById
      var findBrainswarmById = Q.nbind(Brainswarm.findById, Brainswarm);

      // attempt to find the idea by the id passed in
      findBrainswarmById(query)
        .then(function(foundBrain) {
          // if the brainswarm is found update the name and save

          if (foundBrain) {
            if(req.body){
              foundBrain.map =  req.body.map;
            }
            else{
              // Res in this case would be brainswarm map
              foundBrain.map =  res;
            }
            //add more to update dont know what
            foundBrain.save(function(err) {
              if (err) {
                console.log("err")
                res.send(err);
              }
              if(req.body){
                res.json(foundBrain);
              }
            });
          }
        })
        .fail(function(error) {
          next(error);
        });
    },

    getBrainswarm: function(req, res, next){
      // Param most likely an idea Id, could be brainswarm Id
      var getBrainswarm = Q.nbind(Brainswarm.find, Brainswarm);
      var param = req.params.idea_id;
      var query = req.params.idea_id ? { idea: req.params.idea_id } : {};
      getBrainswarm(query)
        .then(function(allBrainswarms) {
        // if idea_id query returned data, send response
        if(allBrainswarms.length > 0) {
          res.json(allBrainswarms);
        } else {
          // if param is not an idea ID, treat as if it is a brainswarm ID
          var query2 = { _id: param };
          getBrainswarm(query2)
            .then(function(brainswarm) {
              if (brainswarm){
                res.json(brainswarm);
              }
            })
        }
      })
      .fail(function(error) {
        console.log("failed")
        next(error);
      });
    }

};


