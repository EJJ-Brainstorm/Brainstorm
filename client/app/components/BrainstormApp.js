var React = require("react");
var Router = require('react-router');
var PageNav = require("./PageNav");
var UserStore = require("../stores/UserStore");
var Reflux = require("reflux");
var RouteHandler = Router.RouteHandler;


var BrainstormApp = React.createClass({

  mixins: [Reflux.ListenerMixin],

  getInitialState: function() {
    return {
      currentUser: UserStore.get()
    };
  },

  onStoreChange: function(){
    if(this.isMounted()) {
        this.setState({ currentUser: UserStore.get() });
      }
  },

  componentDidMount: function() {
    this.listenTo(UserStore,this.onStoreChange);
  },

  render: function() {

    return (
      <div>
        <PageNav />
        <RouteHandler />
      </div>
    );
  }
});

module.exports = BrainstormApp;
