var React = require("react");
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var Router = require('react-router');
var Navigation = Router.Navigation;

var NotFoundView = React.createClass({

  mixins: [Navigation, PureRenderMixin],

  componentDidMount: function() {
    var currentUrl = window.location.href;
    if (currentUrl.substr(currentUrl.length - 3) === "_=_"){
       this.transitionTo('/rooms');
    }
  },

  render: function() {
    return (
      <div>
        <h1> We could not found your route </h1>
      </div>
    )
  }
});

module.exports = NotFoundView;
