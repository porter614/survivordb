import React, { Component } from "react";
import clsx from "clsx";
import { withStyles, makeStyles, lighten } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import FilterListIcon from "@material-ui/icons/FilterList";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import MaterialTable from "material-table";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

const headCells = [
  { id: "contestant", numeric: false, disablePadding: true, label: "Name" },
  {
    id: "challengeWins",
    numeric: true,
    disablePadding: false,
    label: "Challenge Wins",
  },
  { id: "sitOuts", numeric: true, disablePadding: false, label: "Sit Outs" },
  {
    id: "votesForBootee",
    numeric: true,
    disablePadding: false,
    label: "Votes for Bootee",
  },
  {
    id: "votesAgainst",
    numeric: true,
    disablePadding: false,
    label: "Votes Against",
  },
  {
    id: "totalVotesCast",
    numeric: true,
    disablePadding: false,
    label: "Total Votes Cast",
  },
  {
    id: "tribalCouncilAppearances",
    numeric: true,
    disablePadding: false,
    label: "Tribal Council Appearances",
  },
  {
    id: "daysPlayed",
    numeric: true,
    disablePadding: false,
    label: "Days Played",
  },
  {
    id: "place",
    numeric: true,
    disablePadding: false,
    label: "Place",
  },
];

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <Typography
        className={classes.title}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Search
      </Typography>
      <Tooltip title="Filter list">
        <IconButton aria-label="filter list">
          <FilterListIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
};

const ContestantsTableHead = (props) => {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="right"
            padding="default"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

const ContestantsTable = (props) => {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("contestant");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = props.appearances.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  return (
    <Paper>
      <EnhancedTableToolbar numSelected={selected.length} />
      <TableContainer className={classes.paper}>
        <Table className={classes.table} stickyHeader aria-label="sticky table">
          <ContestantsTableHead
            classes={classes}
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={props.appearances.length}
          />
          <TableBody>
            {stableSort(props.appearances, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((appearance, index) => {
                const isItemSelected = isSelected(appearance.name);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, appearance.name)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={appearance.name}
                    selected={isItemSelected}
                  >
                    <StyledTableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      align="right"
                    >
                      {appearance.contestant}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {appearance.challengeWins}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {appearance.sitOuts}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {appearance.votesForBootee}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {appearance.votesAgainst}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {appearance.totalVotesCast}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {appearance.tribalCouncilAppearances}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {appearance.daysPlayed}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {appearance.place}
                    </StyledTableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={props.appearances.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

const Contestants = (props) => {
  return (
    <div>
      <h1 className="title is-1">Contestants</h1>
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
