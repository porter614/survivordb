import React, { Component, useState, useEffect } from "react";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import { Paper, Button, Card } from "@material-ui/core";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import Image from "react-bootstrap/Image";
import ExtraContestantStatistic from "./ContestantKeyValue";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import NativeSelect from "@material-ui/core/NativeSelect";
import { blue } from "@material-ui/core/colors";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    display: "inline-block",
  },
  paper: {
    padding: theme.spacing(2),
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
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
    title: "Age",
  },
  {
    field: "hometown",
    title: "Hometown",
  },
  {
    field: "occupation",
    title: "Occupation",
  },
  {
    field: "challengeWins",
    title: "Challenge Wins",
  },
  {
    field: "individualImmunityChallengeWins",
    title: "Individual Immunity Challenge Wins",
  },
  {
    field: "sitOuts",
    title: "Challenge Sit Outs",
  },
  {
    field: "tribalCouncilAppearances",
    title: "Tribal Council Appearances",
  },
  {
    field: "votesForBootee",
    title: "Votes for Bootee",
  },
  {
    field: "wrongSideOfTheVote",
    title: "Wrong Side of the Vote",
  },
  {
    field: "votesAgainst",
    title: "Votes against Player",
  },
  {
    field: "juryVotesReceived",
    title: "Jury Votes Received",
  },
  {
    field: "idols",
    title: "Idols Found",
  },
];

const PlayerCard = (props) => {
  return (
    <Grid item xs={4} justify="center">
      <FormControl className={styles.formControl}>
        <InputLabel shrink htmlFor="name-native">
          Name
        </InputLabel>
        <NativeSelect
          value={props.picker}
          onChange={props.onHandleChange}
          inputProps={{
            name: "name",
            id: "name-native",
          }}
        >
          <option value="">None</option>
          {Object.keys(props.playerNames).map((key, index) => (
            <option key={index} value={props.playerNames[key]}>
              {key}
            </option>
          ))}
        </NativeSelect>
        <FormHelperText>Compare Against</FormHelperText>
      </FormControl>
      <Paper className={styles.paper} align="center" elevation={10}>
        <Grid container justify="center">
          <Grid item xs={12}>
            <div style={{ width: 256 }}>
              <img
                border="5px solid"
                box-shadow="50px 50px 113px"
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "350px",
                  borderColor: "#74c7e3",
                  borderRadius: "50%",
                }}
                src={props.contestant.career.profile_image_link}
              />
            </div>
          </Grid>
          <Grid item xs={12}>
            <Typography style={{ fontFamily: "Survivants", fontSize: 30 }}>
              {props.contestant.career.contestant}
            </Typography>
          </Grid>
          <Grid item xs={10}>
            <div align="center">
              {headCells.map((statistic) => (
                // eslint-disable-next-line react/jsx-key
                <Card
                  className={styles.paper}
                  style={
                    props.contestant.career[statistic.field] >
                    props.against.career[statistic.field]
                      ? {
                          margin: "20px",
                          background: "green",
                        }
                      : {
                          margin: "20px",
                          background: "red",
                        }
                  }
                >
                  <ExtraContestantStatistic
                    size={12}
                    stat={statistic.title}
                    value={props.contestant.career[statistic.field]}
                  />
                </Card>
              ))}
            </div>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

class ContestantsProfile extends Component {
  constructor() {
    super();

    this.state = {
      contestant: { career: {}, appearances: [] },
      against: { career: {}, appearances: [] },
      picker: "Tyson Apostol",
      againstPicker: "Tyson Apostol",
      playerNames: {},
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeAgainst = this.handleChangeAgainst.bind(this);
  }

  getContestantCareer(id) {
    axios
      .get(
        `${process.env.REACT_APP_USERS_SERVICE_URL}/contestants/careers?id=${id}`
      )
      .then((res) => {
        console.log(res.data[0].contestant);
        this.setState((s) => ({
          ...s,
          contestant: { career: res.data[0] },
        }));
      })
      .catch((err) => {
        console.log(err);
        return {};
      });
  }

  getAgainstCareer(id) {
    axios
      .get(
        `${process.env.REACT_APP_USERS_SERVICE_URL}/contestants/careers?id=${id}`
      )
      .then((res) => {
        this.setState((s) => ({
          ...s,
          against: { career: res.data[0] },
        }));
      })
      .catch((err) => {
        console.log(err);
        return {};
      });
  }

  getPlayerNames() {
    axios
      .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/contestants/names`)
      .then((res) => {
        this.setState((s) => ({ ...s, playerNames: res.data }));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleChange(event) {
    // console.log(this.state.picker);
    this.setState({
      ...this.state,
      picker: event.target.value,
    });
    this.getContestantCareer(event.target.value);
  }

  handleChangeAgainst(event) {
    this.setState({
      ...this.state,
      againstPicker: event.target.value,
    });
    this.getAgainstCareer(event.target.value);
  }

  componentDidMount() {
    this.getContestantCareer(this.props.match.params.id);
    this.getPlayerNames();
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
          <Grid item xs={1} />
          <PlayerCard
            playerNames={this.state.playerNames}
            contestant={this.state.contestant}
            against={this.state.against}
            onHandleChange={this.handleChange}
            picker={this.state.picker}
          />
          <Grid item xs={2} />
          <PlayerCard
            playerNames={this.state.playerNames}
            contestant={this.state.against}
            against={this.state.contestant}
            onHandleChange={this.handleChangeAgainst}
            picker={this.state.againstPicker}
          />
          <Grid item xs={1} />
        </Grid>
      </div>
    );
  }
}

export default ContestantsProfile;
