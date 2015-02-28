var React = require("react");
var Router = require("react-router");
var RoomTitle = require("./IdeaRoomViewComponenets/RoomTitle");
var IdeaForm = require("./IdeaRoomViewComponenets/IdeaForm");
var SearchBar = require("./IdeaRoomViewComponenets/SearchBar");
var Ideas = require("./IdeaRoomViewComponenets/Ideas");
var IdeaStore = require("../../stores/IdeaStore");
var CommentStore = require("../../stores/CommentStore");
var InterestStore = require("../../stores/InterestStore");
var State = Router.State;
var socket = io.connect();

var RoomView = React.createClass({

  mixins: [ State ],

  getInitialState: function() {
    return {
      filterText: '',
      filterNames: ''
    }
  },

  componentDidMount: function() {
    var roomId = this.getParams().roomId;
    socket.emit('join', roomId);
    IdeaStore.setRoom(roomId);
    CommentStore.setRoom(roomId);
    InterestStore.setRoom(roomId);
  },

  handleUserInput: function(filterText, filterNames) {
      this.setState({
          filterText: filterText,
          filterNames: filterNames
      });
  },

  render: function(){
    var roomId = this.getParams().roomId;

    return(
    <div>
       <RoomTitle room_id={roomId}/>
       <IdeaForm room_id={roomId}/>
       <SearchBar
         filterText={this.state.filterText}
         filterNames={this.state.filterNames}
         onUserInput={this.handleUserInput}
        />
      <div className="idea-whiteboard">
        <Ideas room_id={roomId}
         filterText={this.state.filterText}
         filterNames={this.state.filterNames}
        />
       </div>
    </div>
    )
  }

});

module.exports = RoomView;