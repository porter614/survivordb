import React, { Component, useState, useEffect } from "react";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import { Paper } from "@material-ui/core";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import Image from "react-bootstrap/Image";
import ExtraContestantStatistic from "./ContestantKeyValue";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    display: "inline-block",
  },
  paper: {
    padding: theme.spacing(2),
    margin: "auto",
    maxWidth: "100%",
    width: 256,
  },
  image: {
    width: 256,
    height: 256,
  },
  img: {
    margin: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "50%",
    maxHeight: "50%",
    border: "3px solid",
    borderRadius: "50%",
    borderColor: "#74c7e3",
  },
});

function calculateAge(birthday) {
  // birthday is a date
  var ageDifMs = Date.now() - Date.parse(birthday);
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

const headCells = [
  {
    field: "birthdate",
    numeric: true,
    disablePadding: false,
    title: "Age",
    render: (rowData) => calculateAge(rowData.birthdate),
  },
  {
    field: "hometown",
    numeric: true,
    disablePadding: false,
    title: "Hometown",
    customFilterAndSearch: (term, rowData) =>
      rowData.hometown.toLowerCase().includes(term.toLowerCase()),
  },
  {
    field: "occupation",
    numeric: true,
    disablePadding: false,
    title: "Occupation",
    render: (rowData) => rowData.occupations.join(),
    customFilterAndSearch: (term, rowData) =>
      rowData.occupations
        .join()
        .toLowerCase()
        .includes(term.toLowerCase()),
    customSort: (a, b) => a.occupations.length - b.occupations.length,
    group: false,
  },
  {
    field: "challengeWins",
    numeric: true,
    disablePadding: false,
    title: "Challenge Wins",
    customFilterAndSearch: (term, rowData) => term <= rowData.challengeWins,
  },
  {
    field: "individualImmunityChallengeWins",
    numeric: true,
    disablePadding: false,
    title: "Individual Immunity Challenge Wins",
    customFilterAndSearch: (term, rowData) =>
      term <= rowData.individualImmunityChallengeWins,
  },
  {
    field: "sitOuts",
    numeric: true,
    disablePadding: false,
    title: "Challenge Sit Outs",
  },
  {
    field: "tribalCouncilAppearances",
    numeric: true,
    disablePadding: false,
    title: "Tribal Council Appearances",
  },
  {
    field: "votesForBootee",
    numeric: true,
    disablePadding: false,
    title: "Votes for Bootee",
  },
  {
    field: "wrongSideOfTheVote",
    numeric: true,
    disablePadding: false,
    title: "Wrong Side of the Vote",
  },
  {
    field: "votesAgainst",
    numeric: true,
    disablePadding: false,
    title: "Votes against Player",
  },
  {
    field: "juryVotesReceived",
    numeric: true,
    disablePadding: false,
    title: "Jury Votes Received",
  },
  {
    field: "idols",
    numeric: true,
    disablePadding: false,
    title: "Idols Found",
    render: (rowData) => rowData.idols.length,
    customFilterAndSearch: (term, rowData) => term <= rowData.idols.length,
    customSort: (a, b) => a.idols.length - b.idols.length,
  },
];

class ContestantsProfile extends Component {
  constructor() {
    super();

    this.state = {
      contestant: {},
      career: {},
      appearances: [],
    };
  }

  getContestant(id) {
    axios
      .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/contestants/${id}`)
      .then((res) => {
        this.setState((s) => ({ ...s, contestant: res.data }));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getContestantCareer(id) {
    axios
      .get(
        `${process.env.REACT_APP_USERS_SERVICE_URL}/contestants/careers?id=${id}`
      )
      .then((res) => {
        this.setState((s) => ({ ...s, career: res.data[0] }));
        console.log(this.state.career);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidMount() {
    this.getContestant(this.props.match.params.id);
    this.getContestantCareer(this.props.match.params.id);
  }

  render() {
    return (
      <div className={styles.root} align="center">
        <h1 className="title is-1" style={{ fontFamily: "Survivants" }}>
          Contestant Profile
        </h1>
        <hr />
        <br />
        <Grid container>
          <Grid item xs={4} />
          <Grid item xs={4} justify="center">
            <Paper className={styles.paper} align="center" elevation={10}>
              <img
                border="5px solid"
                box-shadow="50px 50px 113px"
                style={{
                  width: 500,
                  borderColor: "#74c7e3",
                  borderRadius: "50%",
                }}
                src={this.state.contestant.profile_image_link}
              />
              <Grid item xs={4} />
              <Grid item xs={12}>
                <Typography style={{ fontFamily: "Survivants", fontSize: 30 }}>
                  {this.state.contestant.name}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <div align="center">
                  {headCells.map((statistic) => (
                    <ExtraContestantStatistic
                      size={12}
                      stat={statistic.title}
                      value={this.state.career[statistic.field]}
                    />
                  ))}
                </div>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default ContestantsProfile;
