import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
} from "@material-ui/core";
import firebase from "firebase";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import GitHubIcon from "@material-ui/icons/GitHub";

import React from "react";
import { useFirebaseAuth } from "./FirebaseAuthContext";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    // root: {
    //   flexGrow: 1,
    //   overflow: "hidden",
    //   padding: theme.spacing(0, 3),
    // },
    // menuButton: {
    //   marginRight: theme.spacing(2),
    // },
    title: {
      flexGrow: 1,
    },
    // formControl: {
    //   margin: theme.spacing(1),
    //   minWidth: 120,
    // },
    // selectEmpty: {
    //   marginTop: theme.spacing(2),
    // },
    // pos: {
    //   marginBottom: 12,
    // },
    // paper: {
    //   maxWidth: 400,
    //   margin: `${theme.spacing(1)}px auto`,
    //   padding: theme.spacing(2),
    // },
    // list: {
    //   width: 250,
    // },
    // fullList: {
    //   width: "auto",
    // },
  })
);

function TopBar() {
  const loggedIn = useFirebaseAuth();
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Mission Classroom
        </Typography>
        <IconButton href="https://github.com/RithwikVaidun/MissionClassroom">
          <GitHubIcon />
        </IconButton>
        {!loggedIn ? (
          <Button
            onClick={() => {
              const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
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
            Logout {loggedIn.email}
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
