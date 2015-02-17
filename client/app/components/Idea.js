var React = require("react");
var IdeaForm = require("./IdeaForm");
var Ideas = require("./Ideas");
var Interest = require("./Interest");
var Comments = require("./Comments");
var UserStore = require("../stores/UserStore");
var IdeaActions = require("../actions/IdeaActions");
var BrainswarmStore = require("../stores/BrainswarmStore");
var BrainswarmActions = require("../actions/BrainswarmActions");
var Q = require('q');

var Idea = React.createClass({
  getInitialState: function() {
    // set initial editing state to false
    return {
      displaying: true,
      editing: false,
      filtered: false,
      currentUser: UserStore.get()
    };
  },

  componentDidMount: function() {
    // add a change listener on the IdeaStore
    // this is needed when the edit comes back and emits a change
    // that will force the component to re-render
    // app.IdeaStore.addChangeListener(function() {
    //   if(this.isMounted()) {
    //     this.setState({editing: false});
    //   }
    // }.bind(this));


  },

  show: function () {
    if (this.isMounted()) {
      this.setState({ displaying: !this.state.displaying });
    }
  },

  render: function() {
    var ideaContent;
    var editForm;
    var currentUser = this.state.currentUser;
    var ideaOwner = this.props.owner;

    // if editing render edit form otherwise render "Edit Idea" button
    if (this.state.editing) {

      Ideas.pauseUpdates = true;

      editForm = <IdeaForm editing="true" owner={this.props.owner} name={this.props.name} key={this.props._id} _id={this.props._id} />

    }

    //if displaying form
    if (this.state.displaying && currentUser) {
        Ideas.pauseUpdates = false;
      // if there is a current user and their id is the same as the ideaOwner id, allow them to edit their own idea
      // othersise if they arent a current user of were'nt the originator of an idea, dont let them edit/delete it. just like or comment it
      var editableOption = (<span></span>);
      if (currentUser._id === ideaOwner) {
        editableOption = (
              <div className="auth-check" style={{display:"inline"}}>
                <button className="fa fa-pencil-square-o" onClick={this.edit}> { this.state.editing ? 'Cancel' : ''} </button>
                <button className="fa fa-trash-o" onClick={this.delete}></button>
              </div>
          )
      }

    ideaContent = (
      <div className="idea">
        <a href="#">
          <form>
            <div>
              <h2 ref="body">{this.props.name}</h2>
              <span>{this.props.ownerName}</span>
              <div className="auth-check watch" style={{display:"inline"}}>
                <Interest idea_id={this.props._id} />
              </div>
              {editForm}
            </div>
            {editableOption}
            <button className="brainSwarm" style={{display:"inline"}} onClick={this.brainswarm}>Brainswarm</button>
            <div className="auth-check comments" style={{display:"inline"}}>
              <Comments idea_id={this.props._id} />
            </div>
          </form>
        </a>
      </div>
    )}

    return (ideaContent);
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
      IdeaActions.delete({ id: this.props._id, owner: this.props.owner });
    }
  },
  brainswarm: function(e) {
    e.preventDefault();

    var brainswarmName = this.props.name + "_brainswarm";
    var name = this.props.name;
    // var brainswarm = BrainswarmStore.checkBrainswarm(this.props._id);
    // if (!brainswarm){
    //   var brainswarm = BrainswarmStore.getBrainswarm(this.props._id);
    // }
    // if (brainswarm){
    //   // get a specific brainstorm
    //   // REFACTOR TO USE AN ACTION
    //   console.log("going to previous brainswarm");
    //   BrainswarmStore.visitBrainswarm(brainswarm._id);
    // } else {
    //   BrainswarmActions.create(this.props._id, brainswarmName);
    // }
    var that = this;
    BrainswarmStore.checkBrainswarm(this.props._id, function(brainswarm){
      if (brainswarm){
        BrainswarmStore.visitBrainswarm(brainswarm._id);
      } else {
        BrainswarmStore.getBrainswarm(that.props._id, function(brainswarmData){
          if (brainswarmData) {
            BrainswarmStore.visitBrainswarm(brainswarmData._id);
          } else {
            BrainswarmActions.create(that.props._id, brainswarmName);
          }
        });
      }
    });






    // CREATE THE BRAINSWARM
    // 1. make a brainswarm action
    // 2. within the brainswarm store
    //  -within the store, make a post request to server to create brainswarm
    //
    // NOT NAVIGATE TO THE BRAINSWARM
    //console.log(e);
    //console.log(this.isMounted());
    //console.log(this.props._id);
    // Put page navigation
    // app.PageActions.navigate({
    //   dest: 'brainswarms',
    //   props: brainswarm.id
    // });

  }
});

module.exports = Idea;

//COMMAND TO POST IDEA ON BEHALF OF FAKE USER (DEVEVELOPMENT PURPOSES ONLY)
// curl -H "Content-Type: application/json" -d '{"name":"theyll never catch me in this fox hole!","ownerName":"Saddam Hussein","room_id":"548a38cebcf20d5101e0e13c"}' http://localhost:3000/ideas/548a38cebcf20d510

