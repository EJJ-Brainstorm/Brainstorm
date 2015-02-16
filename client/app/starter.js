var React = require("react");
var BrainstormApp = require("../react/BrainstormApp.js");

React.render(
  <BrainstormApp />,
  document.getElementById('main')
);

if (document.location.hash.substr(3, 5) === 'rooms'){
  app.PageActions.navigate({

    dest: 'rooms',
    props: document.location.hash.substr(9)

  });
} else {
  app.PageActions.navigate({

    dest: 'welcome'

  });
}

// possibly add a brainswarm in here for when user opens app on a brainswarm url
