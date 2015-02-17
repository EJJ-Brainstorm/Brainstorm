//require app
//require Flux.Dispatcher

var Dispatcher = require('flux').Dispatcher;
var assign = require('object-assign');
// takes objects as arguements and assigns them to one large object
// similar to underscore _extend

var AppDispatcher = assign(new Dispatcher, {
  handleViewAction: function(action) {
    var payload = {
      source: 'VIEW_ACTION',
      action: action
    };
    this.dispatch(payload);
  }
});

module.exports = AppDispatcher;
