var React = require('react');
var IdeaActions = require("../../../actions/IdeaActions");
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var ConfirmationBox = React.createClass({

  mixins: [PureRenderMixin],

  delete: function(e) {
    e.preventDefault();
    if(this.props.id === '' || undefined){
      return
    }
    if (this.isMounted()) {
       IdeaActions.delete({ id: this.props.id, owner: this.props.owner });
    }
  },

  render: function() {
    return (
      <div id="modal1" className="modal">
        <div className="modal-content">
          <h4>Are you sure you want to delete {this.props.name} </h4>
          <h6>Once deleted you will lose all information concering this idea <strong>as well as the associated Brainswarm!</strong></h6>
        </div>
        <div className="modal-footer">
          <a  className="waves-effect waves-red btn-flat modal-action modal-close">Cancel</a>
          <a  className="waves-effect waves-green btn-flat modal-action modal-close" onClick={this.delete}>Delete</a>
        </div>
      </div>
    );
  }
});

module.exports = ConfirmationBox;
