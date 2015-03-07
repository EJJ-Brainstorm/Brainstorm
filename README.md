#Brainstormer

![](http://i.imgur.com/wuEHk5r.png?1)

Brainstormer is built to make the process of brainstorming and idea sharing easier.

Visit [http://brainstormideation.herokuapp.com](http://brainstormideation.herokuapp.com) to try it now!

It leverages [React](https://github.com/facebook/react), [Flux](https://github.com/facebook/flux), and [Socket.io](https://github.com/Automattic/socket.io) to create a truly seamless user and collaborative experience.

[Traditional brainstorming is broken.](https://hbr.org/2014/03/why-you-should-stop-brainstorming)
We anchor onto each others ideas stemming our own creative process, people with strong personalities tend to dominate the conversation, and overall it is just very inefficient.

So we created a software solution for this problem. Introducing brainswarming:

![](http://i.imgur.com/SNeCTR8.png?1)

Ideate ideas in a traditional brainstorm manner but then brainswarm on creating an actionable plan. It is an interactive experience with your colleagues that produces not just more ideas but more "good ideas".

![](http://i.imgur.com/ks6baoL.png?1)

##Roadmap

View the project roadmap/issues [here](https://waffle.io/ejj-brainstorm/brainstorm)

##Interested in Contributing?

Please review [CONTRIBUTING.md](CONTRIBUTING.md)

## Requirements

- Node
- MongoDB
- Gulp
- Bower

## Development

### Installing Dependencies

1. Run npm and bower install

From within the root directory:

```sh
npm install -g react-tools
npm install
bower install
```

&nbsp;
2. npm tasks

```sh
npm start
```

To browserify and start auto-compiling jsx while watching the jsx files and saving on any changes.

All the components will be bundled into a file called bundle.js that is then required within the index.html

&nbsp;
3. Gulp tasks

```sh
gulp
```

To server assets and launch on localhost:3000

&nbsp;
4. Acquire correct github credentials by registering your app [here](https://github.com/settings/applications). Make sure to get your client_id and client_secret. For working in development set your homepage url as: `http://127.0.0.1:3000`. Set your authorization callback url as: `http://localhost:3000/auth/github/callback`

Acquire correct facebook credentials by registering your app [here](https://developers.facebook.com/). Go to "My Apps" and add a new app.

Acquire correct google credentials by registering your app [here](https://console.developers.google.com/project). Create a project, then go to "Credentials" under "APIs & auth" and create a new client Id.

&nbsp;
5. Create a config.js file in /server/config with the following contents:
```sh
var config = {
 github: {
  clientID: "FILL_ME_IN",
  clientSecret: "FILL_ME_IN",
  callbackURL: 'http://localhost:3000/auth/github/callback'
 },
 facebook: {
  clientID: "FILL_ME_IN",
  clientSecret: "FILL_ME_IN",
  callbackURL: 'http://localhost:3000/auth/facebook/callback'
 },
 google: {
  clientID: "FILL_ME_IN",
  clientSecret: "FILL_ME_IN",
  callbackURL: 'http://localhost:3000/auth/google/callback'
 }
};
module.exports = config;
```

