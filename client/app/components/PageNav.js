var React = require("react");
var Router = require('react-router');
var Navigation = Router.Navigation;
var UserAuth = require("./UserAuth");
var UserStore = require("../stores/UserStore");
var Link = Router.Link;
var Reflux = require("reflux");
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var PageNav = React.createClass({

  mixins: [Navigation, Reflux.ListenerMixin, PureRenderMixin],

  getInitialState: function() {
    return {
      currentUser: UserStore.get()
    };
  },

  onStoreChange: function() {
    if(this.isMounted()) {
      this.setState({ currentUser: UserStore.get() });
    }
  },

  componentDidMount: function() {
    this.listenTo(UserStore, this.onStoreChange)
  },

  handleWelcome: function() {
    //dispatch a navigate to welcome on click
    if (this.state.currentUser){
      this.transitionTo('/rooms');
    } else {
      this.transitionTo('/');
    }
  },

  render: function() {
    return (
      <div>
        <header>
          <nav>
            <div className="nav-wrapper  blue darken-3">
              <ul className="login right">
                <UserAuth />
              </ul>
              <ul id="nav-mobile" className="left hide-on-med-and-down">
                <li>
                  <div className="brainstormer" style={{padding: "0rem 1.25rem"}} onClick={this.handleWelcome}>Brainstormer</div>
                </li>
                <li>
                  <Link to="about" style={{padding: "0rem 1.25rem"}}>
                    Getting Started
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </header>
      </div>
    );
  }

});

module.exports = PageNav;
