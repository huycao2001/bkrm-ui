import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
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

import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator';

import * as TableType from "../../../assets/constant/tableType.js"

//styling
import { useTheme } from "@mui/material/styles";
import useStyles from "../../../components/TableCommon/style/mainViewStyle";
import AddTable from "../Table/AddTable/AddTable";
import AddAttribute from "../../InventoryView/Inventory/AddInventory/AddAttribute";
import fbTableApi from "../../../api/fbTableApi";
import fbTableGroupApi from "../../../api/fbTableGroup";
import fbOrderApi from "../../../api/fbOrderApi";
import * as HeadCells from "../../../assets/constant/tableHead";
import TableWrapper from "../../../components/TableCommon/TableWrapper/TableWrapper";
import TableHeader from "../../../components/TableCommon/TableHeader/TableHeader";
import FBOrderRow from "./FBOrderRow/FBOrderRow";
import TableGroupEditor from "../../../components/TableGroup/TableGroupEditor.js";
import ToolBar from "../../../components/TableCommon/ToolBar/ToolBar";
import { statusAction } from "../../../store/slice/statusSlice";

function Kitchen(props) {
  const theme = useTheme();
  const classes = useStyles(theme);
  const [openAddTableDialog, setOpenAddTableDialog] = useState(false);
  const handleCloseAddTableDialog = () => {
    setOpenAddTableDialog(false);
  };
  const handleOpenAddTableDialog = () => {
    setOpenAddTableDialog(true);
  };


  const [openTableGroupEditor, setOpenTableGroupEditor] = useState(false);
  const handleCloseTableGroupEditor = () => {
    setOpenTableGroupEditor(false);
  };
  const handleOpenTableGroupEditor = () => {
    setOpenTableGroupEditor(true);
  };

  const [reloadTableGroupEditor, setReloadTableGroupEditor] = useState(false);


  const [totalRows, setTotalRows] = useState(0);
  const [openRow, setRowOpen] = React.useState(null);
  const [reload, setReload] = useState(true);
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

  const dispatch = useDispatch();

  const refetch = () => {
    return loadOrders();
  }

  const { promiseInProgress } = usePromiseTracker();

  const loadOrders = async () => {
    let response = 0;
    try {
      response = await trackPromise(
        fbOrderApi.getAllFBOrders(
          store_uuid,
          branch_uuid,
          {
            ...query,
            ...pagingState
          }
        )
      );
      setOrderList(response.data.fb_orders);
      console.log(response.data.fb_orders);
    } catch (error) {
      console.log(error);
    }
  };

  const [pagingState, setPagingState] = useState({
    page: 0,
    limit: 10,
  });

  const [tableList, setTableList] = useState([]);
  const [tableGroupList, setTableGroupList] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");

  const initQuery = {
    orderBy: 'priority',
    sort: 'asc',
    searchKey: '',
    status: 'pending'
  };

  const [query, setQuery] = useState(initQuery);

  const handleRequestSort = (event, property) => {
    //// (gửi order vs orderBy lên api) -> fetch lại data để sort
    // const isAsc = orderBy === property && order === 'asc';
    // setOrder(isAsc ? 'desc' : 'asc');
    // setOrderBy(property);
  };
  useEffect(() => {

    if (store_uuid && branch_uuid) {
      loadOrders();
    }
  }, [branch_uuid, reload, query, pagingState.page, pagingState.limit]);


  // useEffect(() => {
  //   const loadTableGroups = async () => {
  //     const response = await fbTableGroupApi.getTableGroupsOfBranch(store_uuid, branch_uuid);
  //     if (response.message === 'Success') {
  //       setTableGroupList(response.data.table_groups.map(tableGroup => {
  //         return {
  //           label: tableGroup.name,
  //           value: tableGroup.name
  //         }
  //       }));
  //     }
  //   }
  //   if (store_uuid) {
  //     loadTableGroups()
  //   }
  // }, [branch_uuid, reloadTableGroupEditor])



  return (
    <Card className={classes.root}>


      <Grid container direction="row" justifyContent="space-between">
        <Typography className={classes.headerTitle} variant="h5">
          Bếp
        </Typography>

        <Grid className={classes.btngroup}  >
          {/* <Tooltip title="Thiết lập nhóm bàn">
            <Button
              variant="outlined"
              color="primary"
              startIcon={<AddIcon />}
              // onClick={handleOpenTableGroupEditor}
              style={{ marginRight: "10px" }}
            >
              Nhóm
            </Button>
          </Tooltip>

          <Tooltip title="Thêm bàn mới">
            <Button
              variant="outlined"
              color="primary"
              startIcon={<AddIcon />}
            // onClick={handleOpenAddTableDialog}
            >
              Thêm
            </Button>
          </Tooltip> */}

          {/* <TableGroupEditor
            openTableGroupEditor={openTableGroupEditor}
            handleCloseTableGroupEditor={handleCloseTableGroupEditor}
            setReload={() => setReload(!reload)}
            reloadTableGroupEditor={reloadTableGroupEditor}
            setReloadTableGroupEditor={setReloadTableGroupEditor}
          /> */}
        </Grid>
      </Grid>
      {/* {openAddTableDialog && (
        <AddTable
          openAddTableDialog={openAddTableDialog}
          handleCloseAddTableDialog={handleCloseAddTableDialog}
          setReload={() => setReload(!reload)}
          reloadTableGroupEditor={reloadTableGroupEditor}
          setReloadTableGroupEditor={setReloadTableGroupEditor}
        />
      )} */}
      <LoadingIndicator />

      {!promiseInProgress && (
        <React.Fragment>
          <ToolBar
            dataTable={tableList}
            tableType={TableType.FBTable}
            textSearch={"#, Tên bàn... "}
            isOnlySearch={false}
            searchKey={query.searchKey}
            setSearchKey={(value) => setQuery({ ...query, searchKey: value })}
            orderByOptions={
              [
                { value: 'wait_time', label: "Thời gian chờ" },
                { value: 'complexity', label: "Khẩu phần" },
                { value: 'priority', label: "Ưu tiên" },
              ]
            }
            orderBy={query.orderBy}
            setOrderBy={(value) => setQuery({ ...query, orderBy: value })}
            sort={query.sort}
            setSort={(value) => setQuery({ ...query, sort: value })}
            tableGroup={query.status}
            tableGroupOptions={[
              {
                value: "pending",
                label: "Đang chờ"
              },
              {
                value: "ready",
                label: "Sẵn sàng"
              },
              {
                value: "closed",
                label: "Đóng"
              },
              {
                value: "dropped",
                label: "Hủy"
              }]}

            setTableGroup={(value) => setQuery({ ...query, status: value })}
            handleRemoveFilter={() => setQuery(initQuery)}

          />

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
              headerData={HeadCells.FBOrderHeadCells}
            />
            <TableBody>
              {orderList.map((row, index) => {
                return (
                  <FBOrderRow
                    key={row.uuid}
                    row={row}
                    setReload={() => setReload(!reload)}
                    openRow={openRow}
                    handleOpenRow={handleOpenRow}
                    isManageInventory={false}
                    refetch={refetch}
                    handleSetReloadTableGroupEditor={() => setReloadTableGroupEditor(!reloadTableGroupEditor)}
                  />
                );
              })}
            </TableBody>
          </TableWrapper>
        </React.Fragment>)}
    </Card>
  );
}

Kitchen.propTypes = {};

export default Kitchen;
