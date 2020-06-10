import React, { Component } from "react"; // new
import ReactDOM from "react-dom";
import axios from "axios";
import UsersList from "./components/UsersList";
import AddUser from "./components/AddUser";

// new
class App extends Component {
  constructor() {
    super();
    // new
    this.state = {
      users: [],
      username: "", // new
      email: "" // new
    };
  }

  addUser = event => {
    event.preventDefault();
    // new
    const data = {
      username: this.state.username,
      email: this.state.email
    };

    // new
    axios
      .post(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`, data)
      .then(res => {
        this.getUsers(); // new
        this.setState({ username: "", email: "" }); // new
      })
      .catch(err => {
        console.log(err);
      });
  };

  componentDidMount() {
    this.getUsers();
  }

  getUsers() {
    axios
      .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`)
      .then(res => {
        this.setState({ users: res.data });
      }) // updated
      .catch(err => {
        console.log(err);
      });
  }

  handleChange = event => {
    const obj = {};
    obj[event.target.name] = event.target.value;
    this.setState(obj);
  };

  render() {
    return (
      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column is-half">
              {" "}
              {/* new */}
              <br />
              <h1 className="title is-1">Users</h1>
              <hr />
              <br />
              <AddUser
                username={this.state.username}
                email={this.state.email}
                addUser={this.addUser}
                // eslint-disable-next-line react/jsx-handler-names
                handleChange={this.handleChange}
              />
              <br />
              <br /> {/* new */}
              <UsersList users={this.state.users} />
            </div>
          </div>
        </div>
      </section>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
