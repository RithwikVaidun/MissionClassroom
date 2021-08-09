import React, { useState, useEffect } from "react";
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
import CardContent from "@material-ui/core/CardContent";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import MyClasses from "./MyClasses";
import clsx from "clsx";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";

import {
  Cls,
  FirebaseUsersCollection,
  FirebaseClassesCollection,
  FirebaseTeachersClassesDic,
} from "./MyInterfaces";
import { ClassRounded } from "@material-ui/icons";
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
  const [cls, setCls] = useState<Cls[] | null>(null);
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
    if (firebaseUserInfo) {
      console.log(firebaseUserInfo);
      let test = Object.keys(firebaseUserInfo.classes).map((x, i) => {
        return firebaseUserInfo.classes[x].id;
      });
      console.log("test", test);
      let ref = db.collection("Classes");
      ref
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

  function writetoFirebase() {
    if (!user) return;
    var batch = db.batch();
    let userRef = db.collection("Users").doc(user.uid);
    if (!user.displayName) user.displayName = "hi";
    let userInfo: FirebaseUsersCollection = {
      name: user.displayName,
      classes: {},
    };
    // batch.set(userRef, userInfo);
    if (!cls) return;
    cls.forEach((c, i, a) => {
      userInfo.classes[c.period] = {
        ...c,
        id: `${c.teacher}Period${c.period}`,
      };
      console.log(userInfo, "userInfo inside");
      // var teacherRef = db.collection("Teachers").doc(c.teacher);
      var classRef = db
        .collection("Classes")
        .doc(`${c.teacher}Period${c.period}`);

      classRef.get().then((doc) => {
        if (doc.exists) {
          batch.update(classRef, {
            students: firebase.firestore.FieldValue.arrayUnion({
              name: user.displayName,
              id: user.uid,
              photo: user.photoURL,
            }),
          });
        } else {
          batch.set(classRef, {
            period: c.period,
            teacher: c.teacher,
            students: [
              {
                name: user.displayName,
                id: user.uid,
                photo: user.photoURL,
              },
            ],
          });
        }
        if (i === a.length - 1) {
          // console.log(userInfo, "userInfo");
          batch.set(userRef, userInfo);
          batch.commit();
        }
      });
    });
  }

  const editClasses = () => {
    setEditMode(true);
  };
  var teachers: string[] = [];

  db.collection("Teachers").onSnapshot((snap) => {
    snap.forEach((doc) => {
      teachers.push(doc.id);
    });
  });

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
            onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
              let newArr: Cls[] = [...(cls ?? [])];
              newArr[i] = { ...newArr[i], period: e.target.value as number };
              setCls(newArr);
              // if (e.target.value) {
              // setCls([...cls, { period: e.target.value }]);
              // }
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
            onChange={(e, value: string | null) => {
              let newArr: Cls[] = [...(cls ?? [])];
              if (value) {
                newArr[i] = { ...newArr[i], teacher: value };
              }
              if (newArr)
                // newArr[i] = { ...newArr[i], teacher: value };
                setCls(newArr);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Teacher"
                onChange={(e) => {
                  let newArr: Cls[] = [...(cls ?? [])];
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

  if (!user) {
    return (
      <>
        <TopBar /> <h1> Please log in with your school account</h1>
      </>
    );
  } else if (editMode) {
    // return <p>HI</p>;
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
    <div className={classes.root}>
      <TopBar />
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

      {/* <p>{JSON.stringify(user)}</p> */}
      {/* <p>{JSON.stringify(cls)}</p> */}
    </div>
  );
}

export default App;
