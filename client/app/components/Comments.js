var React = require("react");
var CommentForm = require("./CommentForm");
var Comment = require("./Comment");
var CommentStore = require("../stores/CommentStore");

var Comments = React.createClass({
  //get all loaded comments
  getInitialState: function () {
    return {
      displaying: false,
      comments: CommentStore.getAll(this.props.idea_id)
    };
  },

  //when we mount the view setup event listener for store changes
  componentDidMount: function () {
    CommentStore.addChangeListener(this.onStoreChange);
  },

  onStoreChange: function(){
    if (this.isMounted()) {
      this.setState({ comments: CommentStore.getAll(this.props.idea_id) });
    }
  },

  componentWillUnmount: function(){
    CommentStore.removeChangeListener(this.onStoreChange);
  },

  show: function (e) {
    e.preventDefault();

    if (this.isMounted()) {
      this.setState({ displaying: !this.state.displaying });
    }
  },

  //render a comment component for each comment
  render: function () {
    var comments;
    var commentForm;
    var showCommentsButton;

    //display comments if we are displaying, otherwise show buttons
    if (this.state.displaying){
      commentForm = <CommentForm idea_id={this.props.idea_id} />
      comments = [];
      //render a comment component for each comment
      this.state.comments.forEach(function (comment) {
        console.log(comment)
        comments.push(
          <Comment ownerName={comment.ownerName} name={comment.name} key={comment._id} _id={comment._id} idea_id={comment.idea_id} />
        );
      });
    }

    showCommentsButton = <button className="fa fa-comments-o" onClick={this.show}>{this.state.displaying? 'Hide' : ''}</button>

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
