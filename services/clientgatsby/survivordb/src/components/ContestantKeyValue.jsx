import React, { Component, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  extraStatKey: {
    display: "inline-block",
    fontWeight: "bold",
  },
  extraStatValue: {
    display: "inline-block",
    padding: "10px",
  },
}));

const ExtraContestantStatistic = (props) => {
  const classes = useStyles();
  return (
    <Grid item xs={props.size}>
      <div>
        <Typography className={classes.extraStatKey}>{props.stat}:</Typography>
        <Typography className={classes.extraStatValue}>
          {props.value}
        </Typography>
      </div>
    </Grid>
  );
};

export default ExtraContestantStatistic;
