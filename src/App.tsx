import React, { useState } from "react";
import "./App.css";
import firebase from "firebase";
import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";

interface Cls {
  name: string;
  teacher: string;
  period: number;
}
function App() {
  const firebaseApp = firebase.apps[0];
  const [cls, setCls] = useState<Cls[]>([{ name: "", teacher: "", period: 0 }]);
  function writetoFirebase(e: any) {
    e.preventDefault();
    firebaseApp.firestore().collection("test").doc("test").set(cls);
  }
  const items = [];
  for (var x = 0; x < 6; x++) {
    let i = x;
    items.push(
      <>
        <TextField
          placeholder="Class Name"
          onChange={(e) => {
            let newArr = [...cls];
            newArr[i] = { ...newArr[i], name: e.target.value };
            setCls(newArr);
          }}
        />
        <TextField
          placeholder="Teacher"
          onChange={(e) => {
            let newArr = [...cls];
            newArr[i] = { ...newArr[i], teacher: e.target.value };
            setCls(newArr);
          }}
        />
        <TextField
          placeholder="Period"
          onChange={(e) => {
            let newArr = [...cls];
            newArr[i] = { ...newArr[i], period: parseInt(e.target.value) };
            setCls(newArr);
          }}
        />
      </>
    );
  }
  return (
    <div>
      <h1>React & Firebase</h1>
      <h2>By @farazamiruddin</h2>
      {items}
      <Button onClick={writetoFirebase}> Hi </Button>

      <p>{JSON.stringify(cls)}</p>
    </div>
  );
}

export default App;
