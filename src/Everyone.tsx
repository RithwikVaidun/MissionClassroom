import { useEffect, useState } from "react";
import firebase from "firebase";
import {
  Button,
  Card,
  CardContent,
  Paper,
  Grid,
  Avatar,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from "@material-ui/core";

function Everyone() {
  const firebaseApp = firebase.apps[0];
  const db = firebaseApp.firestore();
  const [everyone, setEveryone] = useState<JSX.Element[]>([]);
  useEffect(() => {
    db.collection("Classes")
      .where("students", "!=", [])
      .onSnapshot((snapshot) => {
        const tbd: JSX.Element[] = [];
        snapshot.docs.forEach((doc) => {
          if (doc.id === "Teachers") return;
          let data = doc.data();
          console.log(data);
          tbd.push(
            <Card>
              <CardContent>
                <Typography variant="h4" component="h2">
                  {data.teacher} Period {data.period}
                </Typography>
                <List>
                  {data.students.map((s: any) => {
                    return (
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar src={s.photo} />
                        </ListItemAvatar>
                        <ListItemText primary={s.name} />
                      </ListItem>
                    );
                  })}
                </List>
              </CardContent>
            </Card>
          );
        });
        setEveryone(tbd);
      });
  }, []);

  return <div>{everyone}</div>;
}

export default Everyone;
