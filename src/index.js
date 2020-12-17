import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import CssBaseline from '@material-ui/core/CssBaseline'
import { BrowserRouter as Router } from 'react-router-dom';
import firebase from "firebase/app";
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'
import { createStore } from 'redux'
import { rootReducer } from './reducers/firebaseReducers'
import { Provider } from 'react-redux';
import { ReactReduxFirebaseProvider } from "react-redux-firebase";
import { createFirestoreInstance } from 'redux-firestore'
import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core';

const app = firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NODE_ENVREACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
})

export const firestoreDB = app.firestore()
export const firebaseFunctions = app.functions('europe-west1')

firebase.firestore()

const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true,

};

const initialState = {};
const store = createStore(rootReducer, initialState);

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance,
};

export var cosmoTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#23adae',
      contrastText: '#fff'
    },
    secondary: {
      main: '#f4c132'
    },
    error: {
      main: '#de512b',
      contrastText: '#fff'
    },
    info: {
      main: '#894475',
      contrastText: '#fff'
    },
    succes: {
      main: '#55df99'
    },
  },
})

cosmoTheme = responsiveFontSizes(cosmoTheme)

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={cosmoTheme}>
      <Provider store={store} >
        <ReactReduxFirebaseProvider {...rrfProps} >
          <Router>
            <CssBaseline />
            <App />
          </Router>
        </ReactReduxFirebaseProvider>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
