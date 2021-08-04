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
  })
);

function App() {
  const firebaseApp = firebase.apps[0];
  const [cls, setCls] = useState<Cls[]>([{ period: 0, teacher: "" }]);
  const classes = useStyles();

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
          placeholder="Period"
          onChange={(e) => {
            let newArr = [...cls];
            newArr[i] = { ...newArr[i], period: parseInt(e.target.value) };
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

        <br />
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
            <Button color="inherit" href="/signin">
              Login
            </Button>
          </Toolbar>
        </AppBar>
      </div>
      {items}
      <Button onClick={writetoFirebase}> Submit </Button>

      <p>{JSON.stringify(cls)}</p>
    </div>
  );
}

export default App;
