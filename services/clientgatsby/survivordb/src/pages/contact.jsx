// Dependencies
import React, { Component } from "react"
import { ThemeContext } from "../layouts"
import SEO from "../components/seo"
import "./mystyles.scss"
import { Paper } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

class Button extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isClicked: false
    }
    this.logFormDataToConsole = this.logFormDataToConsole.bind(this)
  }

  logFormDataToConsole(event) {
    this.setState({ isClicked: true })
  }

  render() {
    return (
      <button
        disabled={this.state.isClicked}
        onClick={this.logFormDataToConsole}
        style={{ fontFamily: "Survivants", fontSize: "1vw", width: "50%" }}
      >
        Send recommendations or suggestions for new features or data you'd like
        to see.
      </button>
    )
  }
}

const Field = props => (
  <div
    style={{
      display: "block",
      margin: "30px 0"
    }}
  >
    <label style={{ fontFamily: "Survivants" }}>{props.label}</label>
    <input
      onChange={props.onChange}
      type={props.textarea ? "textarea" : "text"}
      value={props.value}
    />
  </div>
)

class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: "",
      email: "",
      message: ""
    }
    // To ensure 'this' when calling 'this.updateField' refers to Form and not Field, we do:
    this.updateField = this.updateField.bind(this)
  }

  // Field could be 'name', 'email', or 'message'
  // Value is whatever the user types into the input field.
  updateField(field, value) {
    this.setState({ [field]: value })
  }

  render() {
    return (
      <React.Fragment>
        <ThemeContext.Consumer>
          {theme => (
            <section
              className="section"
              style={{
                backgroundImage: `url("${theme.backgrounds.desktop}")`,
                backgroundSize: "100%"
              }}
            >
              <SEO title="Contact" />
              <div align="center">
                <Paper
                  style={{
                    padding: "10px",
                    width: "50%",
                    margin: "20px"
                  }}
                  align="center"
                  elevation={10}
                >
                  <div>
                    <Field
                      label="Name: "
                      onChange={event =>
                        this.updateField("name", event.target.value)
                      }
                      value={this.state.name}
                    />

                    <Field
                      label="Email: "
                      onChange={event =>
                        this.updateField("email", event.target.value)
                      }
                      value={this.state.email}
                    />

                    <Field
                      label="Message: "
                      onChange={event =>
                        this.updateField("message", event.target.value)
                      }
                      textarea={true}
                      value={this.state.message}
                    />
                    <Button
                      email="porter614@gmail.com"
                      formValues={this.state}
                    />
                  </div>
                </Paper>
              </div>
            </section>
          )}
        </ThemeContext.Consumer>
      </React.Fragment>
    )
  }
}

export default Form
