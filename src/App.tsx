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
import Select from "@material-ui/core/Select";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";

interface Cls {
  period: string;
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
    pos: {
      marginBottom: 12,
    },
  })
);

function App() {
  const firebaseApp = firebase.apps[0];
  const db = firebaseApp.firestore();
  const [cls, setCls] = useState<Cls[]>([{ period: "", teacher: "" }]);
  const [user, setUser] = useState<firebase.User | null>(null);
  const classes = useStyles();

  function writetoFirebase(e: any) {
    if (!user) return;
    var demo: any = Object.assign({}, cls);
    demo.name = user.displayName;
    db.collection("Users").doc(user.uid).set(demo);

    var batch = db.batch();
    cls.forEach((c, i, a) => {
      var periods: any = {};
      var docRef = db.collection("Teachers").doc(c.teacher);
      docRef.get().then((doc) => {
        if (doc.exists) {
          //update classes
          periods = doc.data();
          if (periods[c.period]) {
            periods[c.period].push({
              name: user.displayName,
              id: user.uid,
            });
          } else {
            periods[c.period] = [{ name: user.displayName, id: user.uid }];
          }
          batch.set(docRef, periods);
        } else {
          console.log("does not exist");
          periods[c.period] = [{ name: user.displayName, id: user.uid }];
          batch.set(docRef, periods);
        }
        if (i == a.length - 1) batch.commit();
      });
    });
  }

  function test() {
    return "ji";
  }
  function getClassmates(c: any) {
    var friends: any = [];
    // db.collection("Teachers")
    //   .doc(c.teacher)
    //   .get()
    //   .then((doc) => {
    //     if (doc.exists) {
    //       var cls: any = doc.data();
    //       friends = cls[c.period].map((a: any) => a.name);
    //     }
    //   });
    return friends;
  }
  var teachers: string[] = ["test", "test2"];

  db.collection("Teachers").onSnapshot((snap) => {
    snap.forEach((doc) => {
      teachers.push(doc.id);
    });
  });

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
            label="Period"
            defaultValue=""
            onChange={(e: any) => {
              let newArr = [...cls];
              newArr[i] = { ...newArr[i], period: e.target.value };
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
            {!user ? (
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
          {items.map((reptile, i) => (
            <div key={i}>{reptile}</div>
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

      {cls.map((c: any, i) => (
        <div key={i}>
          <Card className={classes.root} variant="outlined">
            <CardContent>
              <Typography
                className={classes.title}
                color="textSecondary"
                gutterBottom
              >
                {c.teacher}
              </Typography>

              <Typography className={classes.pos} color="textSecondary">
                {getClassmates(c)}
              </Typography>
            </CardContent>
          </Card>
        </div>
      ))}

      {/* <p>{JSON.stringify(user)}</p> */}
      <p>{JSON.stringify(cls)}</p>
    </div>
  );
}

export default App;
