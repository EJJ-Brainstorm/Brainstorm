var React = require("react");
var User = require("./User");
var PageActions = require("../actions/PageActions");
var UserStore = require("../stores/UserStore");


var PageNav = React.createClass({

  getInitialState: function() {
    return {
      currentUser: UserStore.get()
    };
  },

  componentDidMount: function(){
    UserStore.addChangeListener(function() {
      if(this.isMounted()) {
        this.setState({ currentUser: UserStore.get() });
      }
    }.bind(this));
  },

  handleWelcome:function(){
    //dispatch a navigate to welcome on click
    PageActions.navigate({
      dest: 'welcome'
    });
  },

  handleAbout:function(){
    //dispatch a navigate to about on click
    PageActions.navigate({
      dest: 'about'
    });
  },

  render:function(){
    var heroView;
    var aboutView;
    if (window.globalBoolean){
      heroView = (
        <div id="hero" ref="hero">
          <img className="hero-img" src="styles/assets/stickynotebackground.jpg"/>
          <span className="hero-text">BRAINSTORMER</span>
          <span className="hero-tagline">Ideation + Innovation</span>
        </div>
      );
    }
    if (this.state.currentUser){
      aboutView = (
        <li ref="about">
          <div style={{paddingLeft:"10px", paddingRight:"10px"}} onClick={this.handleAbout}>About</div>
        </li>
      );
    }
    return (
      <div>
        <header ref="body">
          <nav>
            <div className="nav-wrapper  blue darken-3">
              <ul className="login right">
                <User />
              </ul>
              <ul id="nav-mobile" className="left hide-on-med-and-down">
                <li ref="welcome">
                  <div style={{paddingLeft:"10px", paddingRight:"10px"}} onClick={this.handleWelcome}>Brainstormer</div>
                </li>
                {aboutView}
              </ul>
            </div>
          </nav>
        </header>
        {heroView}
      </div>
    );
  }

});

module.exports = PageNav;
