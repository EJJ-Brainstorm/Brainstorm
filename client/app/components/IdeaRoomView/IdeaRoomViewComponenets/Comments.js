var React = require("react");
var CommentForm = require("./CommentForm");
var Comment = require("./Comment");
var CommentStore = require("../../../stores/CommentStore");
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var Reflux = require("reflux");



var Comments = React.createClass({

 mixins: [PureRenderMixin, Reflux.ListenerMixin],

 propTypes: {
  idea_id: React.PropTypes.string
 },

  _url: false,
  //get all loaded comments
  getInitialState: function() {
    var comments = CommentStore.getAll(this.props.idea_id);
    return {
      displaying: false,
      comments: comments
    };
  },

  checkUrl: function(comments){
    for (var i = 0; i < comments.length; i++){
      if (comments[i].toString().slice(0,7) === "http://" || "https:/"){
        comments[i].urlBoolean = true;
      }
    }
  },

  //when we mount the view setup event listener for store changes
  componentDidMount: function() {
    this.listenTo(CommentStore, this.onStoreChange);
  },

  onStoreChange: function(comments){
    if (this.isMounted()) {
      this.setState({ comments: CommentStore.getAll(this.props.idea_id) });
    }
  },


  show: function (e) {
    e.preventDefault();

    if (this.isMounted()) {
      this.setState({ displaying: !this.state.displaying });
    }
  },

  //render a comment component for each comment
  render: function() {
    var comments;
    var commentForm;
    var showCommentsButton;

    //display comments if we are displaying, otherwise show buttons
    if (this.state.displaying){
      var ideaId = this.props.idea_id;
      commentForm = <CommentForm idea_id={ideaId} />
      comments = [];
      //render a comment component for each comment
      this.state.comments.forEach(function(comment) {
        comments.push(
          <Comment anchor={comment.urlBoolean} ownerName={comment.ownerName} name={comment.name} key={comment._id} _id={comment._id} />
        );
      });
    }

    showCommentsButton = <button className="fa fa-comments-o" style={{paddingLeft: ".5rem"}} onClick={this.show}>{this.state.displaying? 'Hide' : ''}</button>

    return (
      <div ref="body" style={{display:"inline"}}>
        { showCommentsButton }
        { comments }
        { commentForm }
      </div>
    );
  }
});

module.exports = Comments;
