var React = require("react");
var RoomCreateForm = require("./RoomCreateForm");
var UserStore = require("../stores/UserStore");
var PageActions = require("../actions/PageActions");
var IdeaStore = require("../stores/IdeaStore");
var RoomActions = require("../actions/RoomActions");

var Room = React.createClass({
  getInitialState: function() {
    // set initial editing state to false
    return {
      displaying: true,
      editing: false,
      filtered: false,
      currentUser: UserStore.get()
    };
  },

  gotoRoom: function(e){
    e.preventDefault();
    PageActions.navigate({
      dest: 'rooms',
      props: this.props._id
    });
  },
  componentDidMount: function() {
    // add a change listener on the IdeaStore
    // this is needed when the edit comes back and emits a change
    // that will force the component to re-render
    IdeaStore.addChangeListener(this._onChange);
  },

  _onChange: function(){
    if(this.isMounted()) {
      this.setState({editing: false});
    }
  },

  componentWillUnmount: function() {
    IdeaStore.removeChangeListener(this._onChange);
  },

  show: function () {
    if (this.isMounted()) {
      this.setState({ displaying: !this.state.displaying });
    }
  },

  render: function() {
    var roomContent;
    var editForm;
    var currentUser = this.state.currentUser
    var roomOwner = this.props.owner

    // console.log("This is the current user")
    // console.log(currentUser)
    // console.log("this is the room owner")
    // console.log(roomOwner);
    // if editing render edit form otherwise render "Edit Idea" button
    if (this.state.editing) {
      editForm = <RoomCreateForm editing="true" owner={this.props.owner} name={this.props.name} key={this.props._id} _id={this.props._id} />
    }

    //if displaying form
    if (this.state.displaying && currentUser) {
      // if there is a current user and their id is the same as the roomOwner id, allow them to edit their own idea
      if (currentUser._id === roomOwner) {
        roomContent = (
          <div className="room pure-u-1">
            <a href="#" onClick={this.gotoRoom}>{this.props.name}</a>
            <form className="pure-form pure-g">
                {editForm}
              </form>
            <div className="pure-u-1-1 auth-check">
              <button className="button-small pure-button pure-button-primary" onClick={this.edit}>{ this.state.editing ? 'Cancel' : 'Edit Room'}</button>
              <button className="button-small pure-button pure-button-primary" onClick={this.delete}>Delete Room</button>
            </div>

          </div>
        );
      }
      //othersise if they arent a current user of were'nt the originator of an idea, dont let them edit/delete it. just like or comment it
      else {
        roomContent = (
          <div className="room pure-u-1">
            <a href="#" onClick={this.gotoRoom}>{this.props.name}</a>
          </div>
        );
      }
    }

    return (
      <div>
          {roomContent}
      </div>
    );
  },

  edit: function(e) {
    e.preventDefault();
    if (this.isMounted()) {
      this.setState({ editing: !this.state.editing });
    }
  },

  delete: function(e) {
    e.preventDefault();
    if (this.isMounted()) {
      RoomActions.delete({ id: this.props._id, owner: this.props.owner });
    }
  }
});

module.exports = Room;
