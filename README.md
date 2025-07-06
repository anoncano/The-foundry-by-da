# The Foundry SPA

This repository contains a single-page application for invoicing and shift logging. The app is served with a minimal Express server.

## Running locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
3. Visit `http://localhost:3000` in your browser.

## Firebase setup

The project is configured for Firebase Hosting using `firebase.json` and `.firebaserc`.
`public/firebase.js` contains placeholder configuration. Replace the keys with your
Firebase project credentials before deploying.

The `public/index.html` file uses React via CDN and Babel to run in the browser.
