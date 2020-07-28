import React, { Component, useState } from "react"
import PropTypes from "prop-types"
import { Paper, Card } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import Box from "@material-ui/core/Box"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import ButtonBase from "@material-ui/core/ButtonBase"
import { Link } from "gatsby"
import ExtraContestantStatistic from "./ContestantKeyValue"

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(1),
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    padding: "10px",
    maxWidth: "100%",
    margin: "20px"
  },
  image: {
    width: 256,
    height: 256
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%"
  },
  extraStatKey: {
    display: "inline-block",
    fontWeight: "bold",
    padding: theme.spacing(1)
  },
  extraStatValue: {
    display: "inline-block",
    padding: "10px",
    padding: theme.spacing(1)
  }
}))

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
  20: "20th"
}

const ContestantToggle = props => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Box m={1}>
        <Grid container spacing={10}>
          <Grid item xs={3} align="center">
            <Grid item xs={12}>
              <Card className={classes.paper} align="center" elevation={10}>
                <Typography variant="h6" style={{ fontFamily: "Survivants" }}>
                  {nth[props.appearance.place]}
                </Typography>
              </Card>
              <img
                className={classes.img}
                alt="complex"
                src={`https://survivordb.s3-us-west-2.amazonaws.com/${props.appearance.season}.jpg`}
                style={{
                  objectFit: "cover",
                  width: "40vh",
                  height: "100%"
                }}
              />
            </Grid>
          </Grid>
          <Grid item xs={9}>
            <Grid container direction="row">
              <Grid item xs={12}>
                <Typography
                  gutterBottom
                  variant="h6"
                  align="center"
                  style={{ fontFamily: "Survivants" }}
                >
                  Additional Metrics
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <br />
              </Grid>
              <Grid item xs={12}>
                <br />
              </Grid>
              <ExtraContestantStatistic
                size={6}
                stat="Days on the Island"
                value={props.appearance.daysPlayed}
              />
              <ExtraContestantStatistic
                size={6}
                stat="Challenge Appearances"
                value={props.appearance.challengeAppearances}
              />
              <ExtraContestantStatistic
                size={6}
                stat="Immunity Challenge Appearances"
                value={props.appearance.immunityChallengeAppearances}
              />
              <ExtraContestantStatistic
                size={6}
                stat="Immunity Challenge Wins"
                value={props.appearance.immunityChallengeWins}
              />
              <ExtraContestantStatistic
                size={6}
                stat="Reward Challenge Appearances"
                value={props.appearance.rewardChallengeAppearances}
              />
              <ExtraContestantStatistic
                size={6}
                stat="Reward Challenge Wins"
                value={props.appearance.rewardChallengeWins}
              />
              <ExtraContestantStatistic
                size={6}
                stat="Individual Reward Challenge Wins"
                value={props.appearance.individualRewardChallengeWins}
              />
              <ExtraContestantStatistic
                size={6}
                stat="Votes Cast at Tribals with this player"
                value={props.appearance.totalVotesCast}
              />
              <Grid item xs={12}>
                <br />
              </Grid>
              <Grid item xs={12}>
                <br />
              </Grid>
              <Grid item xs={12} align="center">
                <ButtonBase>
                  <Link to={`/versus?id=${props.appearance.contestant_id}`}>
                    <Typography
                      style={{ cursor: "pointer", fontFamily: "Survivants" }}
                    >
                      Player Career Profile
                    </Typography>
                  </Link>
                </ButtonBase>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </div>
  )
}

// new
ContestantToggle.propTypes = {
  appearance: PropTypes.any.isRequired
}

export default ContestantToggle
