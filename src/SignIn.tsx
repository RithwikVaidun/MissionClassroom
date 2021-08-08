import React, { useState, useEffect } from "react";
import "./App.css";
import firebase from "firebase";
import { Button } from "@material-ui/core";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import clsx from "clsx";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MailIcon from "@material-ui/icons/Mail";

import {
  Cls,
  FirebaseUsersCollection,
  FirebaseClassesCollection,
  FirebaseTeachersClassesDic,
} from "./MyInterfaces";
import { Dvr } from "@material-ui/icons";
function SignIn() {
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        flexGrow: 1,
        overflow: "hidden",
        padding: theme.spacing(0, 3),
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
      paper: {
        maxWidth: 400,
        margin: `${theme.spacing(1)}px auto`,
        padding: theme.spacing(2),
      },
      list: {
        width: 250,
      },
      fullList: {
        width: "auto",
      },
    })
  );
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const firebaseApp = firebase.apps[0];
  const db = firebaseApp.firestore();
  const [user, setUser] = useState<firebase.User | null>(null);
  const [classrooms, setClassrooms] = useState<
    FirebaseClassesCollection[] | null
  >(null);
  useEffect(() => {
    if (firebase.auth().currentUser) {
      setUser(firebase.auth().currentUser);
    } else {
      setUser(null);
    }
  }, []);
  const list = (anchor: Anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {
          <ListItem button href="/signin">
            <ListItemIcon>
              <MailIcon />
            </ListItemIcon>
            <ListItemText primary={"All Classrooms"} />
          </ListItem>
        }
      </List>
    </div>
  );
  type Anchor = "top" | "left" | "bottom" | "right";
  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };
  useEffect(() => {
    db.collection("Classes")
      .get()
      .then((snap) => {
        let allClassrooms = snap.docs.map((doc) => {
          return doc.data() as FirebaseClassesCollection;
        });
        setClassrooms(allClassrooms);
      });
  });
  const TopBar = () => (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
        >
          <div>
            {/* href="/signin" */}
            {(["left"] as Anchor[]).map((anchor) => (
              <React.Fragment key={anchor}>
                <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
                <SwipeableDrawer
                  anchor={anchor}
                  open={state[anchor]}
                  onClose={toggleDrawer(anchor, false)}
                  onOpen={toggleDrawer(anchor, true)}
                >
                  {list(anchor)}
                </SwipeableDrawer>
              </React.Fragment>
            ))}
          </div>
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" className={classes.title}>
          Mission Classroom
        </Typography>
        {!user ? (
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
            Logout {user.email}
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
  // if (!user) {
  //   return (
  //     <>
  //       <TopBar /> <h1> Please log in with your school account</h1>
  //     </>
  //   );
  // } else {
  return (
    <>
      {classrooms &&
        classrooms.map((c: any, i: any) => (
          <div key={i}>
            <Card variant="outlined">
              <CardContent>
                <h2>
                  {c.teacher} Period {c.period}
                </h2>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <h2>
                    <u>Classmates</u>
                  </h2>
                </div>

                {/* <Typography className={classes.pos} color="textSecondary"> */}
                {c.students.map((s: any, j: any) => (
                  <div>
                    <Paper className={classes.paper}>
                      <Grid container wrap="nowrap" spacing={2}>
                        <Grid item>
                          <Avatar src={s.photo}></Avatar>
                        </Grid>
                        <Grid item xs zeroMinWidth>
                          <Typography noWrap>{s.name}</Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </div>
                ))}
                {/* </Typography> */}
              </CardContent>
            </Card>
          </div>
        ))}
    </>
  );
  // }
}

export default SignIn;
