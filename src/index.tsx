import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import firebase from "firebase";


var firebaseConfig = {
  apiKey: "AIzaSyDWZVyOM16RflypWWXcC1Hu2R-a1e50glY",
  authDomain: "fridge-ba431.firebaseapp.com",
  projectId: "fridge-ba431",
  storageBucket: "fridge-ba431.appspot.com",
  messagingSenderId: "748800175843",
  appId: "1:748800175843:web:3022c69d44f06654b39fd6",
  measurementId: "G-2EWECPPD9P"
};
firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
