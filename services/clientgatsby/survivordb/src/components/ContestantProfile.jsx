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
import * as QueryString from "query-string";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    display: "inline-block",
    zoom: "67%",
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

const nonCompareCells = [
  {
    field: "birthdate",
    title: "Age",
    render: (val) => calculateAge(val),
  },
  {
    field: "hometown",
    title: "Hometown",
    render: (val) => val,
  },
  {
    field: "occupations",
    title: "Occupation",
    render: (val) => val,
  },
];

const headCells = [
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
  { field: "idols", title: "Idols Found" },
  // { field: "place", title: "Place" },
];

const PlayerCard = (props) => {
  const [seasonPicker, setSeasonPicker] = useState(0);

  useEffect(() => {}, [seasonPicker]);

  return (
    <Grid item xs={4} justify="center">
      <FormControl
        className={styles.formControl}
        style={{
          backgroundColor: "#FFFF",
          borderColor: "#00000",
          border: "1px solid",
        }}
      >
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
          style={{ fontFamily: "Survivants", fontSize: 15 }}
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
      <Grid item xs={12} justify="center">
        <br></br>
      </Grid>
      {props.contestant && (
        <Paper className={styles.paper} align="center" elevation={10}>
          <div style={{ padding: 20 }}>
            <Grid container justify="center">
              <Grid item xs={12} p>
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
                <Typography style={{ fontFamily: "Survivants", fontSize: 20 }}>
                  {props.contestant.appearance.contestant}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControl className={styles.formControl}>
                  <InputLabel shrink htmlFor="name-native">
                    Season
                  </InputLabel>
                  <NativeSelect
                    onChange={props.onHandleSeasonChange}
                    style={{ fontFamily: "Survivants", fontSize: 15 }}
                  >
                    <option value={0}>Career</option>
                    {props.contestant.career.seasons.map(
                      (season_order, index) => (
                        <option key={index} value={season_order}>
                          {season_order}
                        </option>
                      )
                    )}
                  </NativeSelect>
                </FormControl>
              </Grid>
              <Grid item xs={10}>
                <div align="center">
                  {nonCompareCells.map((statistic) => (
                    // eslint-disable-next-line react/jsx-key
                    <Card className={styles.paper} style={{ margin: "20px" }}>
                      <ExtraContestantStatistic
                        size={12}
                        stat={statistic.title}
                        value={statistic.render(
                          props.contestant.career[statistic.field]
                        )}
                      />
                    </Card>
                  ))}
                </div>
                <div align="center">
                  {headCells.map((statistic) => (
                    // eslint-disable-next-line react/jsx-key
                    <Card
                      className={styles.paper}
                      style={
                        props.against
                          ? props.contestant.appearance[statistic.field] >
                            props.against.appearance[statistic.field]
                            ? {
                                margin: "20px",
                                background: "#61e885",
                              }
                            : props.contestant.appearance[statistic.field] ==
                              props.against.appearance[statistic.field]
                            ? {
                                margin: "20px",
                                background: "#faff70",
                              }
                            : { margin: "20px", background: "#fc806a" }
                          : { margin: "20px" }
                      }
                    >
                      <ExtraContestantStatistic
                        size={12}
                        stat={statistic.title}
                        value={props.contestant.appearance[statistic.field]}
                      />
                    </Card>
                  ))}
                </div>
              </Grid>
            </Grid>
          </div>
        </Paper>
      )}
    </Grid>
  );
};

class ContestantsProfile extends Component {
  constructor() {
    super();

    this.state = {
      contestant: null,
      against: null,
      picker: "Tyson Apostol",
      againstPicker: "Tyson Apostol",
      playerNames: {},
    };

    this.handleChangeContestant = this.handleChangeContestant.bind(this);
    this.handleChangeAgainst = this.handleChangeAgainst.bind(this);
    this.handleChangeContestantSeason = this.handleChangeContestantSeason.bind(
      this
    );
    this.handleChangeAgainstSeason = this.handleChangeAgainstSeason.bind(this);
  }

  getCareer(who, id) {
    axios
      .get(
        `${process.env.REACT_APP_USERS_SERVICE_URL}/contestants/${id}/career`
      )
      .then((res) => {
        //TODO hack fix this later
        res.data.idols = res.data.idols.length;

        this.setState((s) => ({
          ...s,
          [who]: {
            career: res.data,
            appearance: res.data,
          },
        }));
        console.log(this.state);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getAppearance(who, id, season) {
    axios
      .get(
        `${process.env.REACT_APP_USERS_SERVICE_URL}/appearances?contestant_id=${id}&season=${season}`
      )
      .then((res) => {
        //TODO hack fix this later
        res.data[0].idols = res.data[0].idols.length;
        console.log(res.data[0]);
        this.setState((s) => ({
          ...s,
          [who]: { ...s[who], appearance: res.data[0] },
        }));
        console.log(this.state);
      })
      .catch((err) => {
        console.log(err);
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

  handleChangeContestant(event) {
    this.setState({
      ...this.state,
      picker: event.target.value,
    });
    this.getCareer("contestant", event.target.value);
  }

  handleChangeAgainst(event) {
    this.setState({
      ...this.state,
      againstPicker: event.target.value,
    });
    this.getCareer("against", event.target.value);
  }

  handleChangeSeason(who, event) {
    if (event.target.value != 0) {
      this.getAppearance(
        who,
        this.state.contestant.career.contestant_id,
        event.target.value
      );
    } else {
      this.getCareer(
        who,
        this.state[who].career.contestant_id,
        event.target.value
      );
    }
  }

  handleChangeAgainstSeason(event) {
    this.handleChangeSeason("against", event);
  }

  handleChangeContestantSeason(event) {
    this.handleChangeSeason("contestant", event);
  }

  componentDidMount() {
    this.getCareer("contestant", this.props.match.params.id);
    const params = QueryString.parse(this.props.location.search);
    if (params.against) {
      this.getCareer("against", params.against);
    }
    this.getPlayerNames();
  }

  render() {
    return (
      <div className={styles.root} align="center">
        <h1
          className="title is-1"
          style={{
            fontFamily: "Survivants",
            color: "#74c7e3",
            textShadow: "#000 0px 0px 10px",
          }}
        >
          Contestant Matchup
        </h1>
        <hr />
        <br />
        <Grid container>
          <Grid item xs={1} />
          <PlayerCard
            playerNames={this.state.playerNames}
            contestant={this.state.contestant}
            against={this.state.against}
            onHandleChange={this.handleChangeContestant}
            onHandleSeasonChange={this.handleChangeContestantSeason}
            picker={this.state.picker}
          />
          <Grid item xs={2} />
          <PlayerCard
            playerNames={this.state.playerNames}
            contestant={this.state.against}
            against={this.state.contestant}
            onHandleChange={this.handleChangeAgainst}
            onHandleSeasonChange={this.handleChangeAgainstSeason}
            picker={this.state.againstPicker}
          />
          <Grid item xs={1} />
        </Grid>
      </div>
    );
  }
}

export default ContestantsProfile;
