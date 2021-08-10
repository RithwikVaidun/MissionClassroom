import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import firebase from "firebase";
// import SignIn from "./SignIn";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

// var firebaseConfig = {
//   apiKey: "AIzaSyDWZVyOM16RflypWWXcC1Hu2R-a1e50glY",
//   authDomain: "fridge-ba431.firebaseapp.com",
//   projectId: "fridge-ba431",
//   storageBucket: "fridge-ba431.appspot.com",
//   messagingSenderId: "748800175843",
//   appId: "1:748800175843:web:3022c69d44f06654b39fd6",
//   measurementId: "G-2EWECPPD9P",
// };

var firebaseConfig = {
  apiKey: "AIzaSyBf18UDGBhG0xoiyE0HkHRjL1Dm6DgSeFM",
  authDomain: "mission-class.firebaseapp.com",
  projectId: "mission-class",
  storageBucket: "mission-class.appspot.com",
  messagingSenderId: "525018390258",
  appId: "1:525018390258:web:d37f5dfe4dc61acefaba6b",
  measurementId: "G-CDQKK7T6FR",
};
firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.Fragment>
    <App />
    {/* <Router>
      <Route exact path="/" component={App} />
      <Route exact path="/signin" component={SignIn} />
    </Router> */}
  </React.Fragment>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
