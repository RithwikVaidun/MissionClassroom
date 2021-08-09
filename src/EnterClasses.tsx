import React, { useState, useEffect } from "react";
import {
  Button,
  MenuItem,
  InputLabel,
  TextField,
  Select,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import firebase from "firebase";
// import Select from "react-select";

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
  const [teachers, setTeachers] = useState<string[]>([]);

  useEffect(() => {
    console.log(props.classes);
    if (props.classes) {
      let setclasses: Cls[] | null = props.classes.map((c) => {
        return {
          period: c.period,
          teacher: c.teacher,
          isDisabled: c.period ? true : false,
        };
      });
      for (let i = setclasses.length; i < 6; i++) {
        setclasses.push({ period: -1, teacher: "" });
      }
      console.log(setclasses);
      setCls(setclasses);
    }
    db.collection("Classes")
      .doc("Teachers")
      .get()
      .then((doc) => {
        if (doc.exists) {
          let data = doc.data();
          if (data)
            data.allTeachers ? setTeachers(data.allTeachers) : setTeachers([]);
          // if (data.allTeachers) setTeachers(data!.allTeachers! as string[]);
        }
      });
  }, []);
  // let teacherss = ["test"];
  // db.collection("Teachers").onSnapshot((snap) => {
  //   snap.forEach((doc) => {
  //     console.log("hi");
  //     teachers.push(doc.id);
  //   });
  // });
  // const test = periods.map((a: any) => a.p);
  // console.log(periods);

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
                    {/* <InputLabel>Period</InputLabel> */}
                    {/* <Select options={test}></Select> */}
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
                      options={teachers ? teachers : []}
                      disableClearable
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
        {/* <p>{JSON.stringify(cls)}</p> */}
      </div>
    </>
  );
}

export default EnterClasses;
