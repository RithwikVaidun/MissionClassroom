import React, { useState, useEffect } from "react";
import {
  Button,
  MenuItem,
  InputLabel,
  TextField,
  Select,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import MyAutoComplete from "./MyAutoComplete";
import firebase from "firebase";
import { createFilterOptions } from "@material-ui/lab/Autocomplete";

import {
  EnterClassesInterface,
  Cls,
  FirebaseClassesCollection,
} from "./MyInterfaces";

const filter = createFilterOptions<string>();

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
  const [teachers, setTeachers] = useState<string[]>([
    "Boegman, John",
    "Carattini, Valerie",
    "Cohen, Sandra",
    "Dai, Chelbert",
    "Dotson, Jean",
    "Geers, Katherine",
    "Kang, Flora",
    "LaRosa, Nina",
    "Marple, Ryan",
    "Rath, Brian",
    "Tao, Cassidy",
    "Waller, Elizabeth",
    "Weed-Wolnick, Pat",
    "Bates, Nathaniel",
    "Brucker, Charlie",
    "Frydendahl, Jan",
    "Hoffman, James (Ohlone)",
    "Jan, Michael",
    "Kobylecky, Martin",
    "Lau, David",
    "Liu, Bellamy",
    "Nguyen, Denise",
    "Patil, Mugdha",
    "Robinson, Tyler",
    "Rusu, Iulia",
    "Sahin, Umit",
    "Saldana, Freddy",
    "Saldivar, Melissa",
    "Sugden, Scott",
    "Tseng, Lei",
    "Yang, Jamesk",
    "Bellotti, Anthony",
    "Benton, Nancy",
    "Eugster, Belinda",
    "Hui, Karl",
    "Jeffers, Bill",
    "Kearns, Stephanie",
    "Mathis, Kim",
    "Peterson, Spenser",
    "Remmers, Toby",
    "Salazar, Tanya",
    "Soria, Brian",
    "Tevlin, Rachel",
    "Vierk, Matt",
    "Williams, Katherine",
    "Flores, Rick",
    "Ishimine, Lisa",
    "Kuei, Katy",
    "Kumar, Sai",
    "Magana, Martha",
    "Melcic Lane",
    "Mueller, Sarah",
    "Sawicka, Dorota",
    "Seremeta, Oana",
    "Sharma, Portia",
    "Sultana, Arshiya",
    "Ware, Karrie",
    "Ware-Hartbeck, Lauren",
    "Aucoin, Jason",
    "Hobbs, Jenna",
    "Hui, Donald",
    "Kraft, Monica",
    "Taglianetti, Paul",
    "Evans, Jill",
    "Magana, Leticia",
    "McCarthy, Lin",
    "Okamura, Mariko",
    "Robles-Gracida, Nancy",
    "Sartori, Herveline",
    "Smith, Daniris",
    "Zhang, Qian",
    "Breazeale, Benny",
    "Kaeo, Melissa",
    "Marden, Jack",
    "Randazzo, Stephanie",
    "Thomsen, Thom",
    "Vaz, Pete",
    "Atwell, Stephanie",
    "Chung, Tai",
    "McCauley, Jess",
    "Resendez, Camille",
    "Rynhoud, Elyse",
    "Singh, Sujata",
    "Tse, Sally",
    "Ruebling, Cate",
    "Ware-Hartbeck, Lauren",
    "Breazeale, Ben",
    "Thom Thomsen",
    "Boyer, Julie",
    "Taglianetti, Paul",
    "Tevlin, Rachel",
    "Weed-Wolnick, Pat",
  ]);

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
        console.log("Got the class!");
        if (doc.exists) {
          let data = doc.data();

          if (data) setTeachers(teachers.concat(data.allTeachers));
        }
      });
  }, []);

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
            cls.map((c: any, i) => {
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
                    <MyAutoComplete
                      teachers={teachers}
                      c={c}
                      setCls={setCls}
                      cls={cls}
                      i={i}
                    />
                  </div>
                </div>
              );
            })}
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
