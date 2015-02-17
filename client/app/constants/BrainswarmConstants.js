var keyMirror = require('keymirror');
// creates an object with values equal to its key

var BrainswarmConstants = keyMirror({
  BRAINSWARM_CREATE: null,
  BRAINSWARM_EDIT: null,
  BRAINSWARM_GET: null,
  BRAINSWARM_VISIT: null
});

module.exports = BrainswarmConstants;
