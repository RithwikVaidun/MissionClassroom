// FirebaseAuthContext.tsx
import * as React from "react";
import firebase from "firebase/app";

type User = firebase.User | null;
type ContextState = { user: User };

const FirebaseAuthContext = React.createContext<ContextState | undefined>(
  undefined
);

const FirebaseAuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = React.useState<User>(
    JSON.parse(localStorage.getItem("googleinfo") as string)
  );
  const value = { user };

  React.useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user && user.email!.includes("@fusdk12.net")) {
        localStorage.setItem("googleinfo", JSON.stringify(user));
        setUser(user);
      } else {
        localStorage.clear();
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <FirebaseAuthContext.Provider value={value}>
      {children}
    </FirebaseAuthContext.Provider>
  );
};

function useFirebaseAuth() {
  const context = React.useContext(FirebaseAuthContext);
  if (context === undefined) {
    throw new Error(
      "useFirebaseAuth must be used within a FirebaseAuthProvider"
    );
  }
  return context.user;
}

export { FirebaseAuthProvider, useFirebaseAuth };
