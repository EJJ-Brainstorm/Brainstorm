var React = require("react");
var IdeaActions = require("../actions/IdeaActions");
// var $ = require("jquery");

var IdeaForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    // get the value out of the input with ref="name"
    var name = this.refs.name.getDOMNode();

    // if editing send info to edit method in IdeaActions
    if (this.props.editing) {
      var idea = {id: this.props._id};
      idea.owner = this.props.owner;
      idea.name = name.value.trim();
      IdeaActions.edit(idea);
    } else { // else an idea is being created
      IdeaActions.create(this.props.room_id, name.value.trim());
    }
    // clear the value in the input
    name.value = '';
    return;
  },

  //add pie timer
  componentDidMount: function(){

    $('#pieTimer1').pietimer({
      seconds: 300,
      color: 'rgba(50, 50, 255, 0.8)',
      height: 20,
      width: 50
    }, function(){
        //event after timer here
        //display google links
        $('#hangoutsLink').css("display","inline");

        //allow showing other's ideas

    });

    //start this timer when ready by clicking button...
    $('#startTimer').on("click", function(){
      $('#pieTimer1').pietimer('start');
    })
  },

  render: function(){
    // if editing the defaultValue will be the idea name
    // if editing an "Edit" button will show otherwise a "Create"
    return (
      <form className="auth-check" ref="form" onSubmit={this.handleSubmit}>
        <input className="postfix" type="text" ref="name" defaultValue={this.props.name} placeholder="Add an Idea" />
        <button className="no-margin" type="submit" ref="submit" >{this.props.editing ? "Edit Idea" : "Create"}</button>
        <div className="timer" style={{display:"inline"}}>
          <span> 5 min Timer:</span>
          <button id="startTimer" className="no-margin">start</button>
          <div id="pieTimer1" style={{display:"inline"}}></div>
        </div>
      </form>
    );
  }
});

module.exports = IdeaForm;
