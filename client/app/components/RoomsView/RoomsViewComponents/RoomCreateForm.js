var React = require("react");
var RoomActions = require("../../../actions/RoomActions");
var Router = require("react-router");
var Navigation = Router.Navigation;
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var RoomCreateForm = React.createClass({

  mixins:[Navigation, PureRenderMixin],


  handleSubmit: function(e) {
    e.preventDefault();

    var name = this.refs.name.getDOMNode();

    // if editing send info to edit method in IdeaActions
    if (name.value.trim() === ""){
      return;
    }
    if (this.props.editing) {

      var room = {id: this.props._id};
      room.owner = this.props.owner;
      room.name = name.value.trim();
      RoomActions.edit(room);
    } else { // else an idea is being created
      var self = this;
      RoomActions.create(name.value.trim(), function(roomId){
          self.transitionTo("/rooms/"+ roomId);
      });
    }
    // clear the value in the input
    name.value = '';
    return;
  },

  render: function() {
    return (
      <form className="auth-check pure-form pure-g" ref="form" onSubmit={this.handleSubmit}>
        <input className="pure-u-1-1 pure-u-sm-5-6 postfix" type="text" ref="name" defaultValue={this.props.name} placeholder="Create a Room" />
        <button className="btn waves-effect waves-light" type="submit" ref="submit" >{this.props.editing ? "Edit Room" : "Create"}</button>
      </form>
    );
  }
});

module.exports = RoomCreateForm;
