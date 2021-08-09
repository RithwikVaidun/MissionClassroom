import React, { useState, useEffect } from "react";
import {
  Button,
  MenuItem,
  InputLabel,
  Select,
  TextField,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import firebase from "firebase";

import {
  EnterClassesInterface,
  Cls,
  FirebaseClassesCollection,
} from "./MyInterfaces";

function EnterClasses(props: EnterClassesInterface) {
  const db = firebase.apps[0].firestore();
  const [cls, setCls] = useState<Cls[]>([
    { period: -1, teacher: "" },
    { period: -1, teacher: "" },
    { period: -1, teacher: "" },
    { period: -1, teacher: "" },
    { period: -1, teacher: "" },
    { period: -1, teacher: "" },
  ]);
  const [items, setClsJSX] = useState<JSX.Element[]>([<p>Hi</p>]);
  const [periods, setPeriods] = useState([
    { p: "1", isDisabled: false },
    { p: "2", isDisabled: false },
    { p: "3", isDisabled: true },
    { p: "4", isDisabled: false },
    { p: "5", isDisabled: true },
    { p: "6", isDisabled: false },
  ]);
  useEffect(() => {
    console.log(props.classes);
    if (props.classes) {
      let setclasses: Cls[] | null = props.classes.map((c) => {
        return { period: c.period, teacher: c.teacher };
      });
      for (let i = setclasses.length; i < 6; i++) {
        setclasses.push({ period: -1, teacher: "" });
      }
      console.log(setclasses);
      setCls(setclasses);
    }
  }, []);

  var teachers: string[] = [];

  db.collection("Teachers").onSnapshot((snap) => {
    snap.forEach((doc) => {
      console.log("hi");
      teachers.push(doc.id);
    });
  });

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <ul>
          {cls &&
            cls.map((c, i) => {
              return (
                <div key={i}>
                  <div style={{ float: "left" }}>
                    <InputLabel>Period</InputLabel>
                    <Select
                      style={{ minWidth: 120 }}
                      label="Period"
                      value={c ? c.period : ""}
                      onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                        let newArr: Cls[] = [...(cls ?? [])];
                        newArr[i] = {
                          ...newArr[i],
                          period: e.target.value as number,
                        };
                        setCls(newArr);
                        // if (e.target.value) {
                        // setCls([...cls, { period: e.target.value }]);
                        // }
                      }}
                    >
                      {/* <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={2}>2</MenuItem>
                      <MenuItem value={3}>3</MenuItem>
                      <MenuItem value={4}>4</MenuItem>
                      <MenuItem value={5}>5</MenuItem>
                      <MenuItem value={6}>6</MenuItem> */}
                    </Select>
                  </div>
                  <div style={{ float: "left" }}>
                    <Autocomplete
                      options={teachers}
                      style={{ width: 130 }}
                      value={c ? c.teacher : ""}
                      onChange={(e, value: string | null) => {
                        let newArr: Cls[] = [...(cls ?? [])];

                        if (value) {
                          newArr[i] = { ...newArr[i], teacher: value };
                          setCls(newArr);
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Teacher"
                          onChange={(e) => {
                            let newArr: Cls[] = [...(cls ?? [])];
                            newArr[i] = {
                              ...newArr[i],
                              teacher: e.target.value,
                            };
                            setCls(newArr);
                          }}
                        />
                      )}
                    ></Autocomplete>
                  </div>
                </div>
              );
            })}
          {/* {items.map((reptile, i) => (
            <div key={i}>{reptile}</div>
          ))} */}
        </ul>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            props.writeToDatabase(cls);
          }}
        >
          Submit
        </Button>
      </div>
    </>
  );
}

export default EnterClasses;
