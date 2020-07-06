import React, { Component, useState, useEffect } from "react";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import { Paper } from "@material-ui/core";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import Image from "react-bootstrap/Image";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: "auto",
    maxWidth: "100%",
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

class ContestantsProfile extends Component {
  constructor() {
    super();

    this.state = {
      contestant: {},
    };
  }

  getContestant(id) {
    axios
      .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/contestants/${id}`)
      .then((res) => {
        console.log(this.props);
        this.setState({ contestant: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidMount() {
    console.log(this.props);
    this.getContestant(this.props.match.params.id);
  }

  render() {
    return (
      <div className={styles.root} align="center">
        <h1 className="title is-1">Survivor Contestant Profile</h1>
        <hr />
        <br />
        <Paper className={styles.paper} align="center">
          <Grid container>
            <Grid item xs={3} />
            <Grid item xs={6} justify="center">
              <img
                border="5px solid"
                box-shadow="50px 50px 113px"
                style={{
                  width: 300,
                  borderColor: "#74c7e3",
                  borderRadius: "50%",
                }}
                src={this.state.contestant.profile_image_link}
              />
            </Grid>
            <Grid item xs={3} />
            <Grid item xs={12}>
              <Typography style={{ fontFamily: "Survivants", fontSize: 30 }}>
                {this.state.contestant.name}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}

export default ContestantsProfile;
