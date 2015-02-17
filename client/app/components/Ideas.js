var React = require("react");
var Idea = require("./Idea");
var IdeaStore = require("../stores/IdeaStore");

var Ideas = React.createClass({
  getInitialState: function () {
    return {
      ideas: IdeaStore.getAll()
    };
  },

  pauseUpdates: false,

  componentDidMount: function () {
    IdeaStore.addChangeListener(this.onStoreChange);
  },

  onStoreChange: function(){
    var that = this;
    if(this.isMounted()) {
      if(!that.pauseUpdates){
        this.setState({ ideas: IdeaStore.getAll() });
      }
    }
    // get all ideas from db
  },

  componentWillUnmount: function(){
    IdeaStore.removeChangeListener(this.onStoreChange);
  },

  render: function() {
    var ideas = [];
    var that = this;
    // create all idea components
    this.state.ideas.forEach(function(idea) {
      if (idea.name.toLowerCase().indexOf(that.props.filterText.toLowerCase()) !== -1)
        if (idea.ownerName.toLowerCase().indexOf(that.props.filterNames.toLowerCase()) !== -1)
          ideas.push(<Idea name={idea.name} ownerName={idea.ownerName} owner={idea.owner} room={idea.room} key={idea._id} _id={idea._id} />);
    });
    return (

      <div className = "stickyNotes" ref="body">
        { ideas }
      </div>
    );
  }
});

module.exports = Ideas;
