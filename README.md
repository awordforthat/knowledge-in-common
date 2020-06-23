This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Setup

This project consists of a front end (this repo) and a back end (https://github.com/awordforthat/kic-backend). You'll need
both to run the project.

For development, you'll need Node.js (https://nodejs.org/en/download/) and npm (installed with Node, usually).

After both of the above are installed and both repos are cloned, you can do the following:

0. For development only, the "working" branch for each repo is called `development`. Run `git checkout development` to switch to that branch from master.
1. In the root directory of each repo, run `npm install`
1. In the front end repo, navigate to `src/index.tsx` and change `serverUrl` to be your own local IP. (this is for development only and will change)
1. Your IP needs to be added to the database so it'll allow you access. Email it to me!
1. In the root directory of each repo, run `npm start`. When you do that for the front end, it should launch the browser for you. If not, you can open any browser and go to `http://localhost:3000` to view the homepage.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build:sass`

Transpiles SCSS files to CSS

### `npm run watch:*`

Watches TS, TSX, and SCSS and restarts server on changes (called by `npm start`, no need to call manually)

The page will reload if you make edits.<br />
You will also see any lint errors in the console.
