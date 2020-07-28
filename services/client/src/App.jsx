import React, { Component } from "react";
import axios from "axios";
import ContestantsTable from "./components/ContestantsTable";
import { Route, Switch } from "react-router-dom";
import NavBar from "./components/NavBar";
import UsersList from "./components/UsersList";
import AddUser from "./components/AddUser";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import UserStatus from "./components/UserStatus";
import "./App.css";
import ContestantsProfile from "./components/ContestantProfile";
import ContestantGraph from "./components/ContestantGraph";
import SeasonsTable from "./components/SeasonsTable";

class App extends Component {
  constructor() {
    super();

    this.state = {
      users: [],
      appearances: [],
      careers: [],
      username: "",
      email: "",
      title: "SurvivorDB",
    };

    this.addUser = this.addUser.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRegisterFormSubmit = this.handleRegisterFormSubmit.bind(this);
    this.handleLoginFormSubmit = this.handleLoginFormSubmit.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
  }

  componentDidMount() {
    this.getUsers();
    this.getAppearances();
    this.getCareers();
  }

  getUsers() {
    axios
      .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`)
      .then((res) => {
        this.setState((s) => ({ ...this.state, users: res.data }));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getAppearances() {
    axios
      .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/appearances`)
      .then((res) => {
        console.log(process.env.REACT_APP_USERS_SERVICE_URL);
        this.setState((s) => ({ ...this.state, appearances: res.data }));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getCareers() {
    axios
      .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/contestants/careers`)
      .then((res) => {
        this.setState((s) => ({ ...this.state, careers: res.data }));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleRegisterFormSubmit(data) {
    const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/register`;
    axios
      .post(url, data)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleLoginFormSubmit(data) {
    const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/login`;
    axios
      .post(url, data)
      .then((res) => {
        this.setState({ accessToken: res.data.access_token });
        this.getUsers();
        window.localStorage.setItem("refreshToken", res.data.refresh_token); // new
      })
      .catch((err) => {
        console.log(err);
      });
  }

  isAuthenticated() {
    if (this.state.accessToken || this.validRefresh()) {
      return true;
    }
    return false;
  }

  validRefresh() {
    const token = window.localStorage.getItem("refreshToken");
    if (token) {
      axios
        .post(`${process.env.REACT_APP_USERS_SERVICE_URL}/auth/refresh`, {
          refresh_token: token,
        })
        .then((res) => {
          this.setState({ accessToken: res.data.access_token });
          this.getUsers();
          window.localStorage.setItem("refreshToken", res.data.refresh_token);
          return true;
        })
        .catch((err) => {
          return false;
        });
    }
    return false;
  }

  logoutUser() {
    window.localStorage.removeItem("refreshToken");
    this.setState({ accessToken: null });
  }

  addUser(event) {
    event.preventDefault();

    const data = {
      username: this.state.username,
      email: this.state.email,
    };

    axios
      .post(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`, data)
      .then((res) => {
        this.getUsers();
        this.setState({ username: "", email: "" });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleChange(event) {
    const obj = {};
    obj[event.target.name] = event.target.value;
    this.setState(obj);
  }

  render() {
    return (
      <div>
        <img
          src="https://www.venturefiji.com/wp-content/uploads/2015/12/laucala-island-resort-Laucala-Island-Aerial-South-Coast-2.jpg"
          alt="bg"
          style={{
            // backgroundImage:
            //   'url("https://www.venturefiji.com/wp-content/uploads/2015/12/laucala-island-resort-Laucala-Island-Aerial-South-Coast-2.jpg")',
            height: "auto",
            width: "100%",
            position: "fixed",
            zIndex: -1,
          }}
        />
        <NavBar
          title={this.state.title}
          logoutUser={this.logoutUser}
          isAuthenticated={this.isAuthenticated} // new
        />
        <section className="section">
          <div>
            <br />
            <Switch>
              <Route
                exact
                path="/"
                render={() => (
                  <div align="center">
                    <h1
                      className="title is-1"
                      style={{
                        fontFamily: "Survivants",
                        color: "#74c7e3",
                        fontSize: "200px",
                        textShadow: "#000 0px 0px 10px",
                      }}
                    >
                      Survivor.DB
                    </h1>
                    <h2 className="title is-3" style={{ color: "white" }}>
                      Under construction
                    </h2>
                    <hr />
                    <br />
                    <p style={{ color: "white" }}>
                      A database for all things survivor. Spoilers ahead.
                    </p>
                  </div>
                )}
              />
              <Route
                exact
                path="/players"
                render={() => (
                  <ContestantsTable
                    appearances={this.state.appearances}
                    careers={this.state.careers}
                  />
                )}
              />
              <Route
                exact
                path="/graph"
                render={() => (
                  <ContestantGraph
                    appearances={this.state.appearances.slice(0, 10)}
                  />
                )}
              />
              <Route
                exact
                path="/register"
                render={() => (
                  <RegisterForm
                    handleRegisterFormSubmit={this.handleRegisterFormSubmit}
                    isAuthenticated={this.isAuthenticated}
                  />
                )}
              />
              <Route
                exact
                path="/login"
                render={() => (
                  <LoginForm
                    handleLoginFormSubmit={this.handleLoginFormSubmit}
                    isAuthenticated={this.isAuthenticated}
                  />
                )}
              />
              <Route
                exact
                path="/status"
                render={() => (
                  <UserStatus
                    accessToken={this.state.accessToken}
                    isAuthenticated={this.isAuthenticated}
                  />
                )}
              />
              <Route path="/contestant/:id" component={ContestantsProfile} />
              <Route path="/seasons" component={SeasonsTable} />
            </Switch>
          </div>
        </section>
      </div>
    );
  }
}

export default App;
