var React = require("react");
var UserStore = require("../stores/UserStore");
var InterestActions = require("../actions/InterestActions");
var InterestStore = require("../stores/InterestStore");

var Interest = React.createClass({
  _liked: false,

  checkLiked: function (interests) {
    this._liked = false;
    var currentUser = UserStore.get();
    if (currentUser){
      interests.forEach(function (interest) {
        if (interest.owner === currentUser._id){
          this._liked = interest._id;
        }
      }.bind(this));
    }
  },

  getInitialState: function () {
    var interests = InterestStore.getAll(this.props.idea_id);
    this.checkLiked(interests);
    return {
      interests: interests
    };
  },

  handleClick: function (e) {
    e.preventDefault();
    if (this._liked){
      InterestActions.delete(this._liked);
    } else {
      InterestActions.create(this.props.idea_id);
    }
  },

  componentDidMount: function () {
    InterestStore.addChangeListener(this.onStoreChange);
  },

  onStoreChange: function(){
    if(this.isMounted()) {
      var interests = InterestStore.getAll(this.props.idea_id);
      this.checkLiked(interests);
      this.setState({ interests: interests });
    }
  },

  componentWillUnmount: function() {
    InterestStore.removeChangeListener(this.onStoreChange);
  },

  render: function () {
    var interestCount = this.state.interests.length;
    return (
      <div className="likes" ref="body" style={{display:"inline"}}>
        <button className="button-small pure-button" onClick={this.handleClick}>{this._liked ? 'UnLike' : 'Like'}</button>
        <span>&nbsp;{interestCount} Likes</span>
      </div>
    );
  }

});

module.exports = Interest;
