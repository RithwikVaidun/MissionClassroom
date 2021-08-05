import React, { useState } from "react";
import "./App.css";
import firebase from "firebase";
import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Autocomplete from "@material-ui/lab/Autocomplete";

interface Cls {
  period: number;
  teacher: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  })
);

function App() {
  const firebaseApp = firebase.apps[0];
  const db = firebaseApp.firestore();
  const [cls, setCls] = useState<Cls[]>([{ period: 0, teacher: "" }]);
  const [myuser, setUser] = useState<firebase.User | null>(null);
  const classes = useStyles();

  function writetoFirebase(e: any) {
    e.preventDefault();

    for (var c of cls) {
      if (c !== undefined) {
        var periods: any = {};

        periods[c.period] = ["name", "name2"];
        console.log(periods);

        db.collection("Teachers").doc(c.teacher).update(periods);
      }
    }
  }
  var teachers: string[] = ["test", "test2"];

  // db.collection("Teachers")
  //   .doc("Teachers")
  //   .onSnapshot((doc) => {
  //     teachers = doc.data().teachers;
  //   });

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      setUser(user);
      // User is signed in.
    } else {
      setUser(null);
      // No user is signed in.
    }
  });

  const items = [];
  for (var x = 0; x < 6; x++) {
    let i = x;
    items.push(
      <>
        <div style={{ float: "left" }}>
          <InputLabel>Period</InputLabel>
          <Select
            style={{ minWidth: 120 }}
            labelId="demo-simple-select-label"
            label="Period"
            onChange={(e: any) => {
              let newArr = [...cls];
              newArr[i] = { ...newArr[i], period: parseInt(e.target.value) };
              setCls(newArr);
            }}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={6}>6</MenuItem>
          </Select>
        </div>
        <div style={{ float: "left" }}>
          <Autocomplete
            options={teachers}
            style={{ width: 130 }}
            id="debug"
            debug
            onChange={(e, value: any) => {
              let newArr = [...cls];
              newArr[i] = { ...newArr[i], teacher: value };
              setCls(newArr);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Teacher"
                onChange={(e: any) => {
                  let newArr = [...cls];
                  newArr[i] = { ...newArr[i], teacher: e.target.value };
                  setCls(newArr);
                }}
              />
            )}
          ></Autocomplete>
        </div>
      </>
    );
  }
  return (
    <div>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Mission Classroom
            </Typography>
            {!myuser ? (
              <Button
                onClick={() => {
                  const googleAuthProvider =
                    new firebase.auth.GoogleAuthProvider();
                  firebase.auth().signInWithRedirect(googleAuthProvider);
                }}
              >
                Login
              </Button>
            ) : (
              <Button
                onClick={() => {
                  firebase.auth().signOut();
                }}
              >
                Logout
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <ul>
          {items.map((reptile) => (
            <div>{reptile}</div>
          ))}
        </ul>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button variant="contained" color="primary" onClick={writetoFirebase}>
          Submit
        </Button>
      </div>

      <p>{JSON.stringify(cls)}</p>
    </div>
  );
}

export default App;
