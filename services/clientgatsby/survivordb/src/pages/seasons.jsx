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

const headCells = [
  {
    field: "logo",
    title: "Logo",
    render: rowData => (
      <img
        src={rowData.logo}
        display="block"
        margin-left="auto"
        margin-right="auto"
        style={{
          width: "10vw",
          height: "auto",
          borderColor: "#74c7e3",
          borderRadius: "100%"
        }}
      />
    ),
    grouping: false
  },
  {
    field: "title",
    numeric: false,
    disablePadding: true,
    title: "Theme"
  },
  {
    field: "order",
    disablePadding: true,
    title: "Order"
  },
  {
    field: "contestants",
    numeric: true,
    disablePadding: false,
    title: "Players",
    render: rowData => rowData.contestants.length,
    customFilterAndSearch: (term, rowData) =>
      rowData.contestants.length == parseInt(term),
    customSort: (a, b) => a.contestants.length - b.contestants.length
  },
  {
    field: "finalists",
    numeric: true,
    disablePadding: false,
    title: "Finalists"
  },
  {
    field: "idols_in_game",
    numeric: true,
    disablePadding: false,
    title: "Idols in Game"
  },
  {
    field: "jury_size",
    numeric: true,
    disablePadding: false,
    title: "Jury Size"
  },
  {
    field: "average_player_score",
    numeric: true,
    disablePadding: false,
    title: "Average Player Ranking"
  },
  {
    field: "purple_rock_ranking",
    numeric: true,
    disablePadding: false,
    title: "Purple Rock Ranking"
  },
  {
    field: "returnees",
    numeric: true,
    disablePadding: false,
    title: "Returning Players"
  },
  {
    field: "dnfs",
    numeric: true,
    disablePadding: false,
    title: "Did Not Finish"
  }
]

const theme = createMuiTheme({
  overrides: {
    MuiTableRow: {
      "&:hover": {
        backgroundColor: "#dedede"
      }
    }
  }
})

const SeasonsTable = props => {
  const [data, setData] = useState({
    headers: headCells,
    rows: []
  })

  useEffect(() => {
    axios
      .get(`${process.env.GATSBY_USERS_SERVICE_URL}/seasons`)
      .then(res => {
        setData({
          headers: headCells,
          rows: res.data
        })
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

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
            <SEO title="Seasons" />
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
                Seasons
              </h1>
              <hr />
              <br />
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
                detailPanel={rowData => {}}
                onRowClick={(event, rowData, togglePanel) => togglePanel()}
              />
            </div>
          </section>
        )}
      </ThemeContext.Consumer>
    </React.Fragment>
  )
}

export default SeasonsTable
