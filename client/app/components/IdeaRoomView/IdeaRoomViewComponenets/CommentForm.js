var React = require("react");
var CommentActions = require("../../../actions/CommentActions");
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var CommentForm = React.createClass({

  mixins: [PureRenderMixin],

  getDefaultProps: function() {
    return {
      idea_id: "",
      _id: "",
      editing: false,
      name: ""
    };
  },

  propTypes: {
   idea_id: React.PropTypes.string,
   _id: React.PropTypes.string,
   editing: React.PropTypes.bool,
   name: React.PropTypes.string
  },

  handleSubmit: function(e) {
    e.preventDefault();

    var commentBody = this.refs.input.getDOMNode();
    var comment = commentBody.value.trim();
    //if editing dispatch to edit
    if (comment === ""){
        return;
    }
    if (this.props.editing) {
      CommentActions.edit(this.props._id, comment);
    } else { //otherwise dispatch to create
      CommentActions.create(this.props.idea_id, comment);
    }

    //dispatch an event with the comment text
    commentBody.value = '';
    return;
  },

  render: function() {
    return (
      <form className="pure-form auth-check formComment" ref="body" onSubmit={this.handleSubmit}>

        <input className="pure-u-1-1 pure-u-sm-5-6 postfix comment-form" type="text" ref="input" placeholder="Add your comment..." />
        <button className="no-margin btn waves-effect waves-light comment-button" style={{backgroundColor: "rgba(189, 223, 250, 0.4)", padding: "0px 4px"}} type="submit" ref="submit">{this.props.editing ? 'Edit' : 'Create'}</button>
      </form>
    );
  }

});

module.exports = CommentForm;
