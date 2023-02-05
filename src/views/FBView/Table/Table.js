import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

import AddIcon from "@mui/icons-material/Add";
import {
  Typography,
  Card,
  Button,
  Divider,
  Grid,
  ButtonBase,
  Avatar,
  Tooltip,
  TableBody,
  Box,
} from "@material-ui/core";

//styling
import { useTheme } from "@mui/material/styles";
import useStyles from "../../../components/TableCommon/style/mainViewStyle";
import AddTable from "./AddTable/AddTable";
import AddAttribute from "../../InventoryView/Inventory/AddInventory/AddAttribute";
import fbTableApi from "../../../api/fbTableApi";
import * as HeadCells from "../../../assets/constant/tableHead";
import TableWrapper from "../../../components/TableCommon/TableWrapper/TableWrapper";
import TableHeader from "../../../components/TableCommon/TableHeader/TableHeader";
import FBTableRow from "./FBTableRow/FBTableRow";
function Table(props) {
  const theme = useTheme();
  const classes = useStyles(theme);
  const [openAddTableDialog, setOpenAddTableDialog] = useState(false);
  const handleCloseAddTableDialog = () => {
    setOpenAddTableDialog(false);
  };
  const handleClickOpen = () => {
    setOpenAddTableDialog(true);
  };
  const [totalRows, setTotalRows] = useState(0);
  const [openRow, setRowOpen] = React.useState(null);
  const handleOpenRow = (row) => {
    if (row !== openRow) {
      setRowOpen(row);
    } else {
      setRowOpen(null);
    }
  };
  const infoDetail = useSelector((state) => state.info);
  const store_uuid = infoDetail.store.uuid;
  const branch_uuid = infoDetail.branch.uuid;
  const [pagingState, setPagingState] = useState({
    page: 0,
    limit: 10,
  });
  const [tableList, setTableList] = useState([]);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const handleRequestSort = (event, property) => {
    //// (gửi order vs orderBy lên api) -> fetch lại data để sort
    // const isAsc = orderBy === property && order === 'asc';
    // setOrder(isAsc ? 'desc' : 'asc');
    // setOrderBy(property);
  };
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fbTableApi.getTablesOfBranch(
          store_uuid,
          branch_uuid,
          {}
        );
        //setTotalRows(response.total_rows);
        setTableList(response.data.tables);
        console.log("zzzzzzzz");
        console.log(response.data.tables);
      } catch (error) {
        console.log(error);
      }
    };
    if (store_uuid && branch_uuid) {
      loadData();
    }
  });
  return (
    <Card className={classes.root}>
      <Grid container direction="row" justifyContent="space-between">
        <Typography className={classes.headerTitle} variant="h5">
          Phòng bàn
        </Typography>

        <Grid className={classes.btngroup} sx={{ padding: "10px" }}>
          <Tooltip title="Thêm hàng hóa mới">
            <Button
              variant="outlined"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleClickOpen}
            >
              Thêm
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
      {openAddTableDialog && (
        <AddTable
          openAddTableDialog={openAddTableDialog}
          handleCloseAddTableDialog={handleCloseAddTableDialog}
        />
      )}
      <TableWrapper
        pagingState={{ ...pagingState, total_rows: totalRows }}
        setPagingState={setPagingState}
        list={tableList}
        tableRef={null}
      >
        <TableHeader
          classes={classes}
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
          headerData={HeadCells.FBTableHeadCells}
        />
        <TableBody>
          {tableList.map((row, index) => {
            return (
              <FBTableRow
                key={row.uuid}
                row={row}
                // setReload={() => setReload(!reload)}
                openRow={openRow}
                handleOpenRow={handleOpenRow}
                isManageInventory={false}
              />
            );
          })}
        </TableBody>
      </TableWrapper>
    </Card>
  );
}

Table.propTypes = {};

export default Table;
