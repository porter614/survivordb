import React, { Component, useState, useEffect } from "react"
import { forwardRef } from "react"
import axios from "axios"
import MaterialTable, { MTableToolbar } from "material-table"

import { createMuiTheme } from "@material-ui/core/styles"
import { makeStyles } from "@material-ui/core/styles"

import AddBox from "@material-ui/icons/AddBox"
import ArrowDownward from "@material-ui/icons/ArrowDownward"
import Check from "@material-ui/icons/Check"
import ChevronLeft from "@material-ui/icons/ChevronLeft"
import ChevronRight from "@material-ui/icons/ChevronRight"
import Clear from "@material-ui/icons/Clear"
import DeleteOutline from "@material-ui/icons/DeleteOutline"
import Edit from "@material-ui/icons/Edit"
import FilterList from "@material-ui/icons/FilterList"
import FirstPage from "@material-ui/icons/FirstPage"
import LastPage from "@material-ui/icons/LastPage"
import Remove from "@material-ui/icons/Remove"
import SaveAlt from "@material-ui/icons/SaveAlt"
import Search from "@material-ui/icons/Search"
import ViewColumn from "@material-ui/icons/ViewColumn"
import { Paper, Chip } from "@material-ui/core"
import ContestantToggle from "../components/ContestantToggle"
import FormControl from "@material-ui/core/FormControl"
import Select from "@material-ui/core/Select"
import InputLabel from "@material-ui/core/InputLabel"

import "./mystyles.scss"
import { ThemeContext, Layout } from "../layouts"
import SEO from "../components/seo"

const tableIcons = {
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
}

function calculateAge(birthday) {
  // birthday is a date
  var ageDifMs = Date.now() - Date.parse(birthday)
  var ageDate = new Date(ageDifMs) // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970)
}

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    width: 325
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}))

const headCells = [
  {
    field: "profile_image_link",
    title: "Avatar",
    render: rowData => (
      <img
        src={rowData.image_link}
        display="block"
        margin-left="auto"
        margin-right="auto"
        style={{
          width: "5vw",
          height: "auto",
          borderColor: "#74c7e3",
          borderRadius: "100%"
        }}
      />
    ),
    grouping: false
  },
  {
    field: "contestant",
    numeric: false,
    disablePadding: true,
    title: "Name",
    customFilterAndSearch: (term, rowData) =>
      rowData.contestant.toLowerCase().includes(term.toLowerCase())
  },
  {
    field: "birthdate",
    numeric: true,
    disablePadding: false,
    title: "Age",
    render: rowData => calculateAge(rowData.birthdate)
  },
  {
    field: "hometown",
    numeric: true,
    disablePadding: false,
    title: "Hometown",
    customFilterAndSearch: (term, rowData) =>
      rowData.hometown.toLowerCase().includes(term.toLowerCase())
  },
  {
    field: "occupation",
    numeric: true,
    disablePadding: false,
    title: "Occupation",
    render: rowData => rowData.occupations.join(),
    customFilterAndSearch: (term, rowData) =>
      rowData.occupations
        .join()
        .toLowerCase()
        .includes(term.toLowerCase()),
    customSort: (a, b) => a.occupations.length - b.occupations.length,
    group: false
  },
  {
    field: "challengeWins",
    numeric: true,
    disablePadding: false,
    title: "Challenge Wins",
    customFilterAndSearch: (term, rowData) => term <= rowData.challengeWins
  },
  {
    field: "individualImmunityChallengeWins",
    numeric: true,
    disablePadding: false,
    title: "Individual Immunity Challenge Wins",
    customFilterAndSearch: (term, rowData) =>
      term <= rowData.individualImmunityChallengeWins
  },
  {
    field: "sitOuts",
    numeric: true,
    disablePadding: false,
    title: "Challenge Sit Outs"
  },
  {
    field: "tribalCouncilAppearances",
    numeric: true,
    disablePadding: false,
    title: "Tribal Council Appearances"
  },
  {
    field: "votesForBootee",
    numeric: true,
    disablePadding: false,
    title: "Votes for Bootee"
  },
  {
    field: "wrongSideOfTheVote",
    numeric: true,
    disablePadding: false,
    title: "Wrong Side of the Vote"
  },
  {
    field: "votesAgainst",
    numeric: true,
    disablePadding: false,
    title: "Votes against Player"
  },
  {
    field: "juryVotesReceived",
    numeric: true,
    disablePadding: false,
    title: "Jury Votes Received"
  },
  {
    field: "idols",
    numeric: true,
    disablePadding: false,
    title: "Idols Found",
    render: (rowData, renderType) => rowData.idols.length,
    customFilterAndSearch: (term, rowData) =>
      parseInt(term) <= rowData.idols.length,
    customSort: (a, b) => a.idols.length - b.idols.length
  }
]

const appearanceSpecficCells = [
  {
    field: "place",
    numeric: true,
    disablePadding: false,
    title: "Place",
    customFilterAndSearch: (term, rowData) => term == rowData.place
  },
  {
    field: "season",
    numeric: false,
    disablePadding: true,
    title: "Season",
    defaultSort: "desc"
  },
  {
    field: "rank",
    numeric: true,
    disablePadding: false,
    title: "'Perfect' Game Percentage",
    render: rowData => ((rowData.rank / 18) * 100).toFixed(1).toString() + "%"
  }
]

const careerSpecificCells = [
  {
    field: "seasons",
    numeric: true,
    disablePadding: false,
    title: "Times Played",
    render: rowData => rowData.seasons.length,
    customFilterAndSearch: (term, rowData) => term <= rowData.seasons.length,
    customSort: (a, b) => a.seasons.length - b.seasons.length
  }
]

const insert = (arr, index, newItem) => [
  ...arr.slice(0, index),
  newItem,
  ...arr.slice(index)
]

const spliceCareerHeaders = () => {
  let result = headCells
  for (let val in careerSpecificCells) {
    result = insert(result, 5, careerSpecificCells[val])
  }
  return result
}

const careerHeaders = spliceCareerHeaders()
const appearanceHeaders = headCells.concat(appearanceSpecficCells)

const theme = createMuiTheme({
  overrides: {
    MuiTableRow: {
      "&:hover": {
        backgroundColor: "#dedede"
      }
    }
  }
})

const ContestantsTable = props => {
  const classes = useStyles()
  const [state, setState] = useState("Individual Appearance")
  const [data, setData] = useState({
    headers: headCells,
    rows: []
  })

  const handleChange = event => {
    if (event.target.value != state) {
      setState(event.target.value)
    }
  }

  useEffect(() => {
    let path, headers
    if (state === "Individual Appearance") {
      path = "appearances"
      headers = appearanceHeaders
    } else if (state == "Career") {
      path = "contestants/careers"
      headers = careerHeaders
    }
    console.log(`${process.env.GATSBY_USERS_SERVICE_URL}`)
    axios
      .get(`${process.env.GATSBY_USERS_SERVICE_URL}/${path}`)
      .then(res => {
        setData({
          headers: headers,
          rows: res.data
        })
      })
      .catch(err => {
        console.log(err)
      })
  }, [state])

  return (
    <React.Fragment>
      <ThemeContext.Consumer>
        {theme => (
          <section
            className="section"
            style={{
              backgroundImage: `url("${theme.backgrounds.desktop}")`,
              backgroundSize: "100%"
              // height: "100%"
            }}
          >
            <SEO title="Players" />
            <div align="center">
              <h1
                // className="title is-1"
                style={{
                  fontFamily: "Survivants",
                  color: "#ffffff",
                  fontSize: "4vw",
                  textShadow: "#000 0px 0px 10px",
                  padding: "20px"
                }}
              >
                Players
              </h1>
              <hr />
              <br />
              {/* <ThemeProvider theme={theme}> */}
              <MaterialTable
                style={{
                  zoom: "67%"
                }}
                icons={tableIcons}
                showTitle={false}
                title=" "
                columns={data.headers}
                data={data.rows}
                options={{
                  // tableLayout: "fixed",
                  grouping: true,
                  filtering: true,
                  sorting: true,
                  doubleHorizontalScroll: true,
                  columnsButton: true,
                  pageSize: 25,
                  pageSizeOptions: [5, 10, 25, 50, 100],
                  toolbarButtonAlignment: "right",
                  thirdSortClick: false,
                  searchFieldStyle: {
                    width: "100%"
                  },
                  headerStyle: {
                    position: "sticky",
                    top: 0,
                    backgroundColor: theme.theme.header.color,
                    color: "#FFF",
                    fontFamily: "Survivants",
                    zIndex: 1
                  },
                  rowStyle: (rowData, index) => ({
                    backgroundColor: index % 2 === 0 ? "#EEE" : "#FFF",
                    fontFamily: "Verdana"
                  })
                }}
                detailPanel={rowData => {
                  return <ContestantToggle appearance={rowData} />
                }}
                onRowClick={(event, rowData, togglePanel) => togglePanel()}
                components={{
                  Toolbar: props => (
                    <div align="right">
                      <MTableToolbar {...props} />
                      <div style={{ padding: "0px 10px" }}>
                        <FormControl className={classes.formControl}>
                          <InputLabel htmlFor="age-native-simple">
                            Type
                          </InputLabel>
                          <Select
                            native
                            value={state}
                            onChange={handleChange}
                            inputProps={{
                              name: "age",
                              id: "age-native-simple"
                            }}
                          >
                            <option aria-label="None" value="" />
                            <option value="Individual Appearance">
                              Individual Appearance
                            </option>
                            <option value="Career">Career</option>
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                  )
                }}
              />
            </div>
          </section>
        )}
      </ThemeContext.Consumer>
    </React.Fragment>
  )
}

export default ContestantsTable
