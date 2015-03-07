var React = require("react");
var UserActions = require("../actions/UserActions");
var UserStore = require("../stores/UserStore");
var Router = require("react-router");
var Navigation = Router.Navigation;
var Reflux = require("reflux");
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var UserAuth = React.createClass({

  mixins: [Navigation, Reflux.ListenerMixin],

  getInitialState: function() {
    return { currentUser: UserStore.get() };
  },

  handleClick: function(e) {
    if(this.state.currentUser) {
      e.preventDefault();
      var self = this;
      UserActions.logout(function(){
        self.transitionTo('/');
      });

    }
  },

  render: function() {
    var navBarContent;
    var currentUser = this.state.currentUser;
    var text = currentUser ? 'Logout' : 'Login Via:';
    var username;
    if (currentUser){
      username = currentUser.socialData.name;
    }
    if (!currentUser) {
      navBarContent = (
          <div>
            <li><div style={{padding: "0rem .2rem"}} onClick={this.handleClick}>{text}</div></li>
            <li><a className="ion-social-github login-icon" onClick={this.handleClick} href='/auth/github'></a></li>
            <li><a className="ion-social-facebook login-icon" onClick={this.handleClick} href='/auth/facebook'></a></li>
            <li><a className="ion-social-google login-icon" onClick={this.handleClick} href='/auth/google'></a></li>
          </div>
        );
    } else {
      navBarContent = (
        <div>
          <li><div className="logout-user" onClick={this.handleClick}>{text} {username}</div></li>
        </div>
      );
    }
    return (
      <div>
        {navBarContent}
      </div>
    );
  },

  componentDidMount: function() {
    this.listenTo(UserStore, this.onStoreChange);
    UserActions.getCurrentUser();
  },

  onStoreChange: function() {
    if(this.isMounted()) {
      this.setState({ currentUser: UserStore.get() });
    }
  }


});

module.exports = UserAuth;
