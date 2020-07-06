import React, { Component } from "react";
import { forwardRef } from "react";

import PropTypes from "prop-types";

import MaterialTable from "material-table";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import { Paper } from "@material-ui/core";
import ContestantToggle from "./ContestantToggle";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
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
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

function calculateAge(birthday) {
  // birthday is a date
  console.log(birthday);
  var ageDifMs = Date.now() - Date.parse(birthday);
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  console.log(ageDate);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

const headCells = [
  {
    field: "image_link",
    title: "Avatar",
    render: (rowData) => (
      <img
        src={rowData.image_link}
        border="1px solid"
        box-shadow="50px 50px 113px"
        style={{ width: 100, borderColor: "#74c7e3" }}
      />
    ),
  },
  {
    field: "contestant",
    numeric: false,
    disablePadding: true,
    title: "Name",
    customFilterAndSearch: (term, rowData) =>
      rowData.contestant.toLowerCase().includes(term.toLowerCase()),
  },
  {
    field: "season",
    numeric: false,
    disablePadding: true,
    title: "Season",
  },
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
    render: (rowData) => rowData.occupations.replace(";", ","),
    customFilterAndSearch: (term, rowData) =>
      rowData.occupations.toLowerCase().includes(term.toLowerCase()),
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
  // {
  //   field: "challengeWinPercentage",
  //   numeric: true,
  //   disablePadding: false,
  //   title: "Challenge Win Percentage",
  //   customFilterAndSearch: (term, rowData) =>
  //     term <= rowData.challengeWinPercentage,
  //   render: (rowData) =>
  //     (rowData.challengeWinPercentage * 100).toFixed(0).toString() + "%",
  // },
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
  {
    field: "place",
    numeric: true,
    disablePadding: false,
    title: "Place",
    customFilterAndSearch: (term, rowData) => term == rowData.place,
  },
  {
    field: "rank",
    numeric: true,
    disablePadding: false,
    title: "'Perfect' Game Percentage",
    render: (rowData) =>
      ((rowData.rank / 18) * 100).toFixed(1).toString() + "%",
  },
];

const theme = createMuiTheme({
  overrides: {
    MuiTableRow: {
      "&:hover": {
        backgroundColor: "#dedede",
      },
    },
  },
});

const ContestantsTable = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <MaterialTable
        icons={tableIcons}
        showTitle={false}
        title=" "
        columns={headCells}
        data={props.appearances}
        options={{
          filtering: true,
          sorting: true,
          rowStyle: (rowData, index) => ({
            backgroundColor: index % 2 === 0 ? "#EEE" : "#FFF",
          }),
          pageSize: 25,
          headerStyle: { position: "sticky", top: 0 },
          // maxBodyHeight: "650px",
        }}
        detailPanel={(rowData) => {
          return <ContestantToggle appearance={rowData} />;
        }}
        onRowClick={(event, rowData, togglePanel) => togglePanel()}
      />
    </ThemeProvider>
  );
};

const Contestants = (props) => {
  return (
    <div align="center">
      <h1 className="title is-1" style={{ fontFamily: "Survivants" }}>
        Survivor Players
      </h1>
      <hr />
      <br />
      <ContestantsTable appearances={props.appearances}> </ContestantsTable>
    </div>
  );
};

// new
Contestants.propTypes = {
  appearances: PropTypes.array.isRequired,
};

export default Contestants;
