/* eslint-disable no-use-before-define */
import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import { Cls } from "./MyInterfaces";
const filter = createFilterOptions<string>();
interface AutoC {
  teachers: string[];
  c: Cls;
  cls: Cls[];
  setCls: React.Dispatch<React.SetStateAction<Cls[]>>;
  i: number;
}

export default function FreeSoloCreateOption(props: AutoC) {
  return (
    <Autocomplete
      value={props.c.teacher}
      onChange={(event, newValue) => {
        let newArr: Cls[] = [...(props.cls ?? [])];
        newArr[props.i] = { ...newArr[props.i], teacher: newValue as string };
        props.setCls(newArr);
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        // Suggest the creation of a new value
        if (params.inputValue !== "") {
          filtered.push(params.inputValue);
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text-demo"
      options={props.teachers}
      getOptionLabel={(option) => {
        return option;
      }}
      renderOption={(option) => option}
      style={{ width: 300 }}
      freeSolo
      renderInput={(params) => (
        <TextField {...params} style={{ width: 180 }} label="Teacher" />
      )}
    />
  );
}
