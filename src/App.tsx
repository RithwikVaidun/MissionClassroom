import React, { useState, useEffect } from "react";
import "./App.css";
import firebase from "firebase";
// import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

// import IconButton from "@material-ui/core/IconButton";
// import MenuIcon from "@material-ui/icons/Menu";
// import InputLabel from "@material-ui/core/InputLabel";
// import MenuItem from "@material-ui/core/MenuItem";
// import Select from "@material-ui/core/Select";
// import Autocomplete from "@material-ui/lab/Autocomplete";
// import Card from "@material-ui/core/Card";
// import CardContent from "@material-ui/core/CardContent";
// import Box from "@material-ui/core/Box";
// import Paper from "@material-ui/core/Paper";
// import Grid from "@material-ui/core/Grid";
// import Avatar from "@material-ui/core/Avatar";
import MyClasses from "./MyClasses";
// import clsx from "clsx";
// import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
// import List from "@material-ui/core/List";
// import Divider from "@material-ui/core/Divider";
// import ListItem from "@material-ui/core/ListItem";
// import ListItemIcon from "@material-ui/core/ListItemIcon";
// import ListItemText from "@material-ui/core/ListItemText";
// import InboxIcon from "@material-ui/icons/MoveToInbox";
// import MailIcon from "@material-ui/icons/Mail";
import EnterClasses from "./EnterClasses";

import {
  Cls,
  FirebaseUsersCollection,
  FirebaseClassesCollection,
  FirebaseTeachersClassesDic,
} from "./MyInterfaces";
// import SignIn from "./SignIn";
// import MyClasses from "./MyClasses";

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

function App() {
  const firebaseApp = firebase.apps[0];
  const db = firebaseApp.firestore();

  const [user, setUser] = useState<firebase.User | null>(null);
  const [firebaseUserInfo, setFirebaseUserInfo] =
    useState<FirebaseUsersCollection | null>(null);
  const [classmates, setClassmates] = useState<
    FirebaseClassesCollection[] | null
  >(null);
  const [editMode, setEditMode] = useState(false);

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
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

  const classes = useStyles();
  useEffect(() => {
    if (firebase.auth().currentUser) {
      setUser(firebase.auth().currentUser);
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (user) {
      db.collection("Users")
        .doc(user.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setFirebaseUserInfo(snapshot.data() as FirebaseUsersCollection);
          }
        });
    }
  }, [user]);
  useEffect(() => {
    if (firebaseUserInfo && Object.keys(firebaseUserInfo.classes).length > 0) {
      console.log(firebaseUserInfo);
      let test = Object.keys(firebaseUserInfo.classes).map((x, i) => {
        return firebaseUserInfo.classes[x].id;
      });
      console.log("test", test);
      db.collection("Classes")
        .where(firebase.firestore.FieldPath.documentId(), "in", test)
        .get()
        .then((snapshot) => {
          let allClassmates = snapshot.docs.map((doc) => {
            return doc.data() as FirebaseClassesCollection;
          });
          // snapshot.forEach((doc) => {
          //   console.log("doc", doc.data());
          // });
          console.log(allClassmates, "ac");
          setClassmates(allClassmates);
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  }, [firebaseUserInfo]);
  function writetoFirebase(cls: Cls[]) {
    if (!user) return;
    var batch = db.batch();
    let userRef = db.collection("Users").doc(user.uid);
    if (!user.displayName) user.displayName = "hi";
    let userInfo: FirebaseUsersCollection = {
      name: user.displayName,
      classes: {},
    };
    if (!cls) return;
    cls.forEach((c, i, a) => {
      if (c && c.teacher && c.period) {
        // If the user already has a class in firebase
        // if (
        //   firebaseUserInfo &&
        //   firebaseUserInfo.classes[c.period] &&
        //   (firebaseUserInfo.classes[c.period].period != c.period ||
        //     firebaseUserInfo.classes[c.period].teacher != c.teacher)
        // ) {
        //   // The class is different from the one in firebase so delete user from the old class
        //   let oldClassRef = db
        //     .collection("Classes")
        //     .doc(firebaseUserInfo.classes[c.period].id);
        //   batch.update(oldClassRef, {
        //     students: firebase.firestore.FieldValue.arrayRemove({
        //       name: user.displayName,
        //       id: user.uid,
        //       photo: user.photoURL,
        //     }),
        //   });
        //   // userInfo.classes[c.period] = firebase.firestore.FieldValue.delete();
        // }

        // Update the firebase user info
        userInfo.classes[c.period] = {
          ...c,
          id: `${c.teacher}-${c.period}`,
          period: c.period,
          teacher: c.teacher,
          teacherid: c.teacher,
        };
        let classRef = db.collection("Classes").doc(`${c.teacher}-${c.period}`);
        batch.set(
          classRef,
          {
            period: c.period,
            teacher: c.teacher,
            students: firebase.firestore.FieldValue.arrayUnion({
              name: user.displayName,
              id: user.uid,
              photo: user.photoURL,
            }),
          },
          { merge: true }
        );
      } else {
      }
    });
    // userInfo.classes has the new classes and firebaseUserInfo.classes has the old classes
    if (firebaseUserInfo) {
      Object.keys(firebaseUserInfo.classes).forEach((x, i, a) => {
        console.log(firebaseUserInfo);
        console.log(firebaseUserInfo.classes[x], "firebaseUserInfo.classes[x]");
        console.log(userInfo.classes[x], "userInfo.classes[x]");
        if (
          !userInfo.classes[x] ||
          (firebaseUserInfo.classes[x] &&
            userInfo.classes[x].id !== firebaseUserInfo.classes[x].id)
        ) {
          console.log("They are not the same!");
          // If the class is different from the one in firebase delete user from the old class
          let oldClassRef = db
            .collection("Classes")
            .doc(firebaseUserInfo.classes[x].id);
          batch.update(oldClassRef, {
            students: firebase.firestore.FieldValue.arrayRemove({
              name: user.displayName,
              id: user.uid,
              photo: user.photoURL,
            }),
          });
        }
      });
    }

    batch.set(userRef, userInfo);
    batch.commit().then(() => {
      console.log("Successfully wrote data to firebase!");
    });
  }

  const editClasses = () => {
    setEditMode(true);
  };

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      //&& user.email?.includes("@fusdk12.net")
      setUser(user);
      // User is signed in.
    } else {
      setUser(null);
      // No user is signed in.
    }
  });

  // const list = (anchor: Anchor) => (
  //   <div
  //     className={clsx(classes.list, {
  //       [classes.fullList]: anchor === "top" || anchor === "bottom",
  //     })}
  //     role="presentation"
  //     onClick={toggleDrawer(anchor, false)}
  //     onKeyDown={toggleDrawer(anchor, false)}
  //   >
  //     <List>
  //       {
  //         <ListItem button href="/signin">
  //           <ListItemIcon>
  //             <MailIcon />
  //           </ListItemIcon>
  //           <ListItemText primary={"All Classrooms"} />
  //         </ListItem>
  //       }
  //     </List>
  //   </div>
  // );
  const TopBar = () => (
    <AppBar position="static">
      <Toolbar>
        {/* <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
        >
          <div>
            href="/signin"
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
        </IconButton> */}

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
  if (!user) {
    return (
      <>
        <TopBar /> <h1> Please log in with your school account</h1>
      </>
    );
  } else if (editMode) {
    return (
      <>
        <TopBar />
        <EnterClasses writeToDatabase={writetoFirebase} classes={classmates} />
      </>
    );
    // return <EditClasses />;
  } else if (firebaseUserInfo) {
    return (
      <>
        <TopBar />
        <br />
        <MyClasses classmates={classmates} editClass={editClasses} />
      </>
    );
  }
  return (
    // <div className={classes.root}>
    <>
      <TopBar />
      <EnterClasses writeToDatabase={writetoFirebase} classes={null} />

      {/* <p>{JSON.stringify(user)}</p> */}
      {/* <p>{JSON.stringify(cls)}</p> */}
    </>
    // </div>
  );
}

export default App;
