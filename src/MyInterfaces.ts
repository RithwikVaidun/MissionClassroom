// Interface for when the user enters their classes
export interface Cls {
  period: number | null;
  teacher: string | null;
}

// Interface for firebase student

export interface FirebaseUsersClassesDic {
  [key: string]: {
    id: string;
    period: number;
    teacher: string;
    teacherid: string;
  };
}
export interface FirebaseUsersCollection {
  classes: FirebaseUsersClassesDic;
  name: string;
}

// Interface    for firebase teachers

export interface FirebaseTeachersClassesDic {
  [index: number]: string;
  // classID: string;
}
export interface FirebaseTeachersCollection {
  classes: FirebaseTeachersClassesDic;
  name: string;
}

// Interface for firebase classes
export interface FirebaseClassesCollection {
  students: {
    id: string;
    name: string;
    photo: string;
  }[];
  teacher: string;
  period: number;
}

export interface MyClassesInterface {
  classmates: FirebaseClassesCollection[] | null;
  editClass: () => void;
}

export interface EnterClassesInterface {
  writeToDatabase: (cls: Cls[]) => void;
  classes: FirebaseClassesCollection[] | null;
}
