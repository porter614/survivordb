import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";
import { Link } from "react-router-dom";
import ExtraContestantStatistic from "./ContestantKeyValue";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit,
    margin: "auto",
    maxWidth: "100%",
  },
  image: {
    width: 256,
    height: 256,
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
  },
  extraStatKey: {
    display: "inline-block",
    fontWeight: "bold",
    padding: theme.spacing.unit,
  },
  extraStatValue: {
    display: "inline-block",
    padding: "10px",
    padding: theme.spacing.unit,
  },
}));

const nth = {
  1: "Winner",
  2: "2nd",
  3: "3rd",
  4: "4th",
  5: "5th",
  6: "6th",
  7: "7th",
  8: "8th",
  9: "9th",
  10: "10th",
  11: "11th",
  12: "12th",
  13: "13th",
  14: "14th",
  15: "15th",
  16: "16th",
  17: "17th",
  18: "18th",
  19: "19th",
  20: "20th",
};

const ContestantToggle = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Box m={1}>
          <Grid container spacing={32}>
            <Grid container xs={3}>
              <Grid item xs={12}>
                <Paper className={classes.paper} align="center">
                  {nth[props.appearance.place]}
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <ButtonBase>
                  <img
                    className={classes.img}
                    alt="complex"
                    src={`https://survivordb.s3-us-west-2.amazonaws.com/${props.appearance.season}.jpg`}
                  />
                </ButtonBase>
              </Grid>
            </Grid>
            <Grid container xs={9} direction="row">
              <Grid item xs={12}>
                <Typography gutterBottom variant="subtitle1" align="center">
                  Additional Metrics
                </Typography>
              </Grid>
              <ExtraContestantStatistic
                size={4}
                stat="Days on the Island"
                value={props.appearance.daysPlayed}
              />
              <ExtraContestantStatistic
                size={4}
                stat="Challenge Appearances"
                value={props.appearance.challengeAppearances}
              />
              <ExtraContestantStatistic
                size={4}
                stat="Immunity Challenge Appearances"
                value={props.appearance.immunityChallengeAppearances}
              />
              <ExtraContestantStatistic
                size={4}
                stat="Immunity Challenge Wins"
                value={props.appearance.immunityChallengeWins}
              />
              <ExtraContestantStatistic
                size={4}
                stat="Reward Challenge Appearances"
                value={props.appearance.rewardChallengeAppearances}
              />
              <ExtraContestantStatistic
                size={4}
                stat="Reward Challenge Wins"
                value={props.appearance.rewardChallengeWins}
              />
              <ExtraContestantStatistic
                size={4}
                stat="Individual Reward Challenge Wins"
                value={props.appearance.individualRewardChallengeWins}
              />
              <ExtraContestantStatistic
                size={4}
                stat="Votes Cast at Tribals with this player"
                value={props.appearance.totalVotesCast}
              />
              <Grid item xs={12}>
                <div align="center">
                  <ButtonBase>
                    <Link to={`/contestant/${props.appearance.contestant_id}`}>
                      <Typography style={{ cursor: "pointer" }}>
                        Player Career Profile
                      </Typography>
                    </Link>
                  </ButtonBase>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </div>
  );
};

// new
ContestantToggle.propTypes = {
  appearance: PropTypes.any.isRequired,
};

export default ContestantToggle;
