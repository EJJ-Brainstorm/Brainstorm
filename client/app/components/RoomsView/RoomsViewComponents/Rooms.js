var React = require("react");
var Room = require("./Room");
var RoomStore = require("../../../stores/RoomStore");
var IdeaActions = require("../../../actions/IdeaActions");
var RoomActions = require("../../../actions/RoomActions");
var Router = require('react-router');
var Navigation = Router.Navigation;
var Reflux = require("reflux");

var Rooms = React.createClass({

  mixins: [Navigation, Reflux.ListenerMixin],

  getInitialState: function() {
    return {
      rooms: RoomStore.getAll()
    };
  },

  componentDidMount: function() {
    this.listenTo(RoomStore, this.onStoreChange);
    RoomActions.all();
    IdeaActions.all();
  },

  onStoreChange: function() {
    if(this.isMounted()) {
      this.setState({ rooms: RoomStore.getAll() });
    }
  },


  render: function() {
    var rooms = [];
    this.state.rooms.forEach(function(room) {
      rooms.push(<Room name={room.name} ownerName={room.ownerName} owner={room.owner} key={room._id} _id={room._id} />);
    });
    return (
      <div className="rooms">
        { rooms }
      </div>
    );
  }
});

module.exports = Rooms;
