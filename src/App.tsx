import React, { useState } from 'react';
import './App.css';
import firebase from "firebase";
import TextField from '@material-ui/core/TextField';

interface cls {
  name: string;
  teacher: string;
  period: number;
}
function App() {
  const firebaseApp = firebase.apps[0];
  const [name, setName] = useState<string>()
  return (
    <div>
      <h1>React & Firebase</h1>
      <h2>By @farazamiruddin</h2>
      <TextField onChange={(e) => {
        setName(e.target.value)
      }}/>
      <p>{name}</p>
    </div>
  );
}

export default App;
