import React, { useState, useEffect } from "react";
import "./App.css";
import firebase from "firebase";
import { Button, IconButton } from "@material-ui/core";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import GitHubIcon from "@material-ui/icons/GitHub";

import MyClasses from "./MyClasses";

import EnterClasses from "./EnterClasses";

import {
  Cls,
  FirebaseUsersCollection,
  FirebaseClassesCollection,
} from "./MyInterfaces";

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
interface LoginInfo {
  email: string;
}
function App() {
  const firebaseApp = firebase.apps[0];
  const db = firebaseApp.firestore();

  const [loggedIn, setLoggedIn] = useState<LoginInfo | null>(
    JSON.parse(localStorage.getItem("googleinfo") as string)
  );
  const [firebaseUserInfo, setFirebaseUserInfo] =
    useState<FirebaseUsersCollection | null>(
      JSON.parse(localStorage.getItem("firebaseuser") as string)
    );
  const [classmates, setClassmates] = useState<
    FirebaseClassesCollection[] | null
  >(JSON.parse(localStorage.getItem("classmates") as string));
  const [editMode, setEditMode] = useState(false);

  const classes = useStyles();
  useEffect(() => {
    if (firebaseUserInfo && Object.keys(firebaseUserInfo.classes).length > 0) {
      let test = Object.keys(firebaseUserInfo.classes).map((x, i) => {
        return firebaseUserInfo.classes[x].id;
      });
      db.collection("Classes")
        .where(firebase.firestore.FieldPath.documentId(), "in", test)
        .onSnapshot((snapshot) => {
          let allClassmates = snapshot.docs.map((doc) => {
            return doc.data() as FirebaseClassesCollection;
          });
          setClassmates(allClassmates);
          localStorage.setItem("classmates", JSON.stringify(allClassmates));
        });
    }
    firebase.auth().onAuthStateChanged(function (authuser) {
      if (authuser && authuser.email!.includes("@fusdk12.net")) {
        localStorage.setItem(
          "googleinfo",
          JSON.stringify({ email: authuser.email })
        );
        setLoggedIn({ email: authuser.email } as LoginInfo);
        // setLoggedIn(true);
        // User is signed in.
      } else {
        localStorage.clear();
        setLoggedIn(null);
        // No user is signed in.
      }
    });
  }, []);

  useEffect(() => {
    if (firebaseUserInfo && Object.keys(firebaseUserInfo.classes).length > 0) {
      let test = Object.keys(firebaseUserInfo.classes).map((x, i) => {
        return firebaseUserInfo.classes[x].id;
      });
      db.collection("Classes")
        .where(firebase.firestore.FieldPath.documentId(), "in", test)
        .onSnapshot((snapshot) => {
          let allClassmates = snapshot.docs.map((doc) => {
            return doc.data() as FirebaseClassesCollection;
          });
          setClassmates(allClassmates);
          localStorage.setItem("classmates", JSON.stringify(allClassmates));
        });
    }
  }, [firebaseUserInfo, db]);
  function writetoFirebase(cls: Cls[]) {
    let user = firebase.auth().currentUser;
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
        // Update the firebase user info
        userInfo.classes[c.period] = {
          ...c,
          id: `${c.teacher}-${c.period}`,
          period: c.period,
          teacher: c.teacher,
        };
        let classRef = db.collection("Classes").doc(`${c.teacher}-${c.period}`);

        let teachersRef = db.collection("Classes").doc("Teachers");
        batch.update(teachersRef, {
          allTeachers: firebase.firestore.FieldValue.arrayUnion(c.teacher),
        });

        batch.set(
          classRef,
          {
            period: c.period,
            teacher: c.teacher,
            students: firebase.firestore.FieldValue.arrayUnion({
              name: user!.displayName,
              id: user!.uid,
              photo: user!.photoURL,
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
        if (
          !userInfo.classes[x] ||
          (firebaseUserInfo.classes[x] &&
            userInfo.classes[x].id !== firebaseUserInfo.classes[x].id)
        ) {
          // If the class is different from the one in firebase delete user from the old class
          let oldClassRef = db
            .collection("Classes")
            .doc(firebaseUserInfo.classes[x].id);
          batch.update(oldClassRef, {
            students: firebase.firestore.FieldValue.arrayRemove({
              name: user!.displayName,
              id: user!.uid,
              photo: user!.photoURL,
            }),
          });
        }
      });
    }

    batch.set(userRef, userInfo);
    batch.commit().then(() => {
      db.collection("Users")
        .doc(user!.uid)
        .get()
        .then((snapshot) => {
          setFirebaseUserInfo(snapshot.data() as FirebaseUsersCollection);
          localStorage.setItem("firebaseuser", JSON.stringify(snapshot.data()));
          setEditMode(false);
        });
    });
  }

  const editClasses = () => {
    setEditMode(true);
  };

  const TopBar = () => (
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
  if (!loggedIn) {
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
  } else if (firebaseUserInfo) {
    return (
      <>
        <TopBar />
        <br />
        <MyClasses classmates={classmates} editClass={editClasses} />
      </>
    );
  }
  console.log("rereindering");
  return (
    <>
      <TopBar />
      <EnterClasses writeToDatabase={writetoFirebase} classes={null} />

      {/* <p>{JSON.stringify(user)}</p> */}
      {/* <p>{JSON.stringify(cls)}</p> */}
    </>
  );
}

export default App;
