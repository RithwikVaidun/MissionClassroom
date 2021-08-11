import React, { useState, useEffect } from "react";
import "./App.css";
import firebase from "firebase";
import MyClasses from "./MyClasses";
import EnterClasses from "./EnterClasses";
import { useFirebaseAuth } from "./FirebaseAuthContext";
import {
  Cls,
  FirebaseUsersCollection,
  FirebaseClassesCollection,
} from "./MyInterfaces";
import TopBar from "./TopBar";
interface LoginInfo {
  email: string;
}
function App() {
  const firebaseApp = firebase.apps[0];
  const db = firebaseApp.firestore();
  const loggedIn = useFirebaseAuth();

  // const [loggedIn, setLoggedIn] = useState<LoginInfo | null>(
  //   JSON.parse(localStorage.getItem("googleinfo") as string)
  // );
  const [firebaseUserInfo, setFirebaseUserInfo] =
    useState<FirebaseUsersCollection | null>(
      JSON.parse(localStorage.getItem("firebaseuser") as string)
    );
  const [classmates, setClassmates] = useState<
    FirebaseClassesCollection[] | null
  >(JSON.parse(localStorage.getItem("classmates") as string));
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (loggedIn) {
      if (
        firebaseUserInfo &&
        Object.keys(firebaseUserInfo.classes).length > 0
      ) {
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
    }
  }, []);

  // useEffect(() => {
  //   if (firebaseUserInfo && Object.keys(firebaseUserInfo.classes).length > 0) {
  //     let test = Object.keys(firebaseUserInfo.classes).map((x, i) => {
  //       return firebaseUserInfo.classes[x].id;
  //     });
  //     db.collection("Classes")
  //       .where(firebase.firestore.FieldPath.documentId(), "in", test)
  //       .onSnapshot((snapshot) => {
  //         let allClassmates = snapshot.docs.map((doc) => {
  //           return doc.data() as FirebaseClassesCollection;
  //         });
  //         setClassmates(allClassmates);
  //         localStorage.setItem("classmates", JSON.stringify(allClassmates));
  //       });
  //   }
  // }, [firebaseUserInfo, db]);
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
    cls.forEach((c) => {
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
    </>
  );
}

export default App;
