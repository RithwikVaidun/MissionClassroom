import {
  Button,
  Card,
  CardContent,
  Paper,
  Grid,
  Avatar,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { MyClassesInterface } from "./MyInterfaces";

// CSS Styles
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      maxWidth: 400,
      margin: `${theme.spacing(1)}px auto`,
      padding: theme.spacing(2),
    },
  })
);

function MyClasses(props: MyClassesInterface) {
  const classes = useStyles();
  return (
    <>
      <Button variant="contained" color="primary" onClick={props.editClass}>
        Edit
      </Button>
      {props.classmates &&
        props.classmates.map((c: any, i: any) => (
          <div key={i}>
            <Card variant="outlined">
              <CardContent>
                <h2>
                  {c.teacher} Period {c.period}
                </h2>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <h2>
                    <u>Classmates</u>
                  </h2>
                </div>

                {c.students.map((s: any, j: any) => (
                  <div>
                    <Paper className={classes.paper}>
                      <Grid container wrap="nowrap" spacing={2}>
                        <Grid item>
                          <Avatar src={s.photo}></Avatar>
                        </Grid>
                        <Grid item xs zeroMinWidth>
                          <Typography noWrap>{s.name}</Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        ))}
    </>
  );
}

export default MyClasses;
