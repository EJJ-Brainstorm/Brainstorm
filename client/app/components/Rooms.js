var React = require("react");
var Room = require("./Room");
var RoomStore = require("../stores/RoomStore");

var Rooms = React.createClass({
  getInitialState: function() {
    return {
      rooms: RoomStore.getAll()
    };
  },

  componentDidMount: function() {
    RoomStore.addChangeListener(this._onChange);
    RoomStore.all();
  },

  _onChange: function(){
    if(this.isMounted()) {
      this.setState({ rooms: RoomStore.getAll() });
    }
  },

  componentWillUnmount: function(){
    RoomStore.removeChangeListener(this._onChange);
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
