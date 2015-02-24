var React = require("react");
var CreateRoom = require("./CreateRoom");
var Rooms = require("./Rooms");
var RoomTitle = require("./RoomTitle");
var CreateIdea = require("./IdeaForm");
var SearchBar = require("./SearchBar");
var Ideas = require("./Ideas");
var Brainswarm = require("./Brainswarm");
var PageNav = require("./PageNav");
var UserStore = require("../stores/UserStore");
var PageStore = require("../stores/PageStore");
var PageActions = require("../actions/PageActions");
var About = require("./About");
var socket = io.connect();

var BrainstormApp = React.createClass({
  getInitialState: function() {
    return {
      indexView: true,
      roomView: false,
      aboutView: false,
      currentUser: UserStore.get(),
      filterText: '',
      filterNames: ''
    };
  },

  componentDidMount: function () {
    window.globalBoolean = true;
    UserStore.addChangeListener(function() {
      if(this.isMounted()) {
        this.setState({ currentUser: UserStore.get() });
      }
    }.bind(this));

    PageStore.addChangeListener(function(){

      //get state from the PageStore.currentRoute
      var state = PageStore.currentRoute;

      //if props is undefined set it to empty string
      state.props = state.props || '';
      state.indexView = (state.dest === 'welcome' ? true : false);
      state.roomView = (state.dest === 'rooms' ? true : false);
      state.aboutView = (state.dest === 'about' ? true : false);
      if (state.dest === 'rooms'){
        setTimeout(function () {
          PageActions.getRoomData(state.props);
        }, 0);
      } else if (state.dest === 'brainswarms') {
        setTimeout(function () {
          PageActions.getBrainswarmData(state.props);
        }, 0);
      }
      this.setState(state);

      if(!state.indexView && !state.roomView && !state.aboutView) {
        socket.emit('join-brainswarm', state.props);
      } else if (!state.indexView && !state.aboutView) {
        socket.emit('join', state.props);
      }
    }.bind(this));
  },

  handleUserInput: function(filterText, filterNames) {
      this.setState({
          filterText: filterText,
          filterNames: filterNames
      });
  },

  render: function(){
    var currentView;
    if(this.state.indexView) { //thisIsHomePage
      currentView = (
        <div>
          <CreateRoom />
          <Rooms />
        </div>
      );
    } else if (this.state.roomView) { // must be a room
      currentView = (
        <div>
          <RoomTitle room_id={this.state.props}/>
          <CreateIdea room_id={this.state.props}/>
          <SearchBar
              filterText={this.state.filterText}
              filterNames={this.state.filterNames}
              onUserInput={this.handleUserInput}
          />
          <div className="idea-whiteboard">
          <Ideas room_id={this.state.props}
            filterText={this.state.filterText}
            filterNames={this.state.filterNames}
          />
            </div>
        </div>
      );
    } else if (this.state.aboutView) {
      currentView = (
        <About />
      );

    } else { // brainswarm
     currentView = (
      <div>
        <Brainswarm _id={this.state.props}/>

      </div>
     );
    }

    return (
      <div className={'user-' + !!this.state.currentUser} >
        <PageNav />
        { currentView }
      </div>
    );
  }
});

module.exports = BrainstormApp;
