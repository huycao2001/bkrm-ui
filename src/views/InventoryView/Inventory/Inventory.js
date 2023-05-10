// import React from react;

import { useDispatch, useSelector } from "react-redux";
import useStyles from "../../../components/TableCommon/style/mainViewStyle";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import productApi from "../../../api/productApi";
import storeApi from "../../../api/storeApi";
import Category from "./Category/Category";
import SnackBar from "../../../components/SnackBar/SnackBar";

import React, { useState, useEffect, useRef } from "react";
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
import { useReactToPrint } from "react-to-print";

import { trackPromise } from "react-promise-tracker";
import AddIcon from "@mui/icons-material/Add";
import AddInventory from "./AddInventory/AddInventory";

// Constants
import * as TableType from "../../../assets/constant/tableType";
import * as HeadCells from "../../../assets/constant/tableHead";
// Components
import TableWrapper from "../../../components/TableCommon/TableWrapper/TableWrapper";
import TableHeader from "../../../components/TableCommon/TableHeader/TableHeader";
import InventoryTableRow from "./InventoryTableRow/InventoryTableRow";
import LoadingIndicator from "../../../components/LoadingIndicator/LoadingIndicator";
import ToolBar from "../../../components/TableCommon/ToolBar/ToolBar";

//Setting
import setting from "../../../assets/constant/setting";

import { statusAction } from "../../../store/slice/statusSlice";
import CustomExcel from "./CustomExcel";
import * as excel from "../../../assets/constant/excel";
export default function Inventory() {
  const [productList, setProductList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  //Redux
  const infoDetail = useSelector((state) => state.info);
  const store_uuid = infoDetail.store.uuid;
  const branch_uuid = infoDetail.branch.uuid;

  const store_type = useSelector((state) => state.info.store.store_type);
  const store_setting = infoDetail.store.general_configuration
    ? JSON.parse(infoDetail.store.general_configuration)
    : setting;

  const [openFilter, setOpenFilter] = React.useState(false);
  const handleToggleFilter = () => {
    setOpenFilter(!openFilter);
  };
  const importProductByJSON = async (jsonData) => {
    try {
      setOpenProductImportPopper(true);
      setIsLoadingProduct(true);
      const res = await storeApi.importProductJSON(
        store_uuid,
        branch_uuid,
        jsonData
      );
      if (res.status) {
        setIsLoadingProduct(false);
        setOpenProductImportPopper(false);
        setReload(!reload);
        dispatch(statusAction.successfulStatus("Nhập hàng thành công"));
      } else {
        setIsLoadingProduct(false);
        setProductErrors(res.data);
        dispatch(statusAction.failedStatus("Nhập hàng thất bại"));
      }
      // setOpen(true);
    } catch (err) {
      console.log(err);
      dispatch(statusAction.failedStatus("Nhập hàng thất bại"));
      setIsLoadingProduct(false);
      // setOpen(false);
    }
  };

  // header sort
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");

  const handleRequestSort = (event, property) => {
    //// (gửi order vs orderBy lên api) -> fetch lại data để sort
    // const isAsc = orderBy === property && order === 'asc';
    // setOrder(isAsc ? 'desc' : 'asc');
    // setOrderBy(property);
  };

  // Styling
  const theme = useTheme();
  const classes = useStyles(theme);
  const xsScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const [openAddInventoryDialog, setOpenAddInventoryDialog] = useState(false);
  const [openBar, setOpenBar] = React.useState(false);
  const [addStatus, setAddStatus] = React.useState(null);
  const handleCloseBar = () => {
    setOpenBar(false);
  };
  const initialQuery = {
    orderBy: "products.created_at",
    sort: "desc",
    searchKey: "",
    minStandardPrice: "",
    maxStandardPrice: "",
    minListPrice: "",
    maxListPrice: "",
    minInventory: "",
    maxInventory: "",
    status: "",
    categoryId: "",
  };
  const handleRemoveFilter = () => {
    setQuery(initialQuery);
  };
  const [totalRows, setTotalRows] = useState(0);
  const [query, setQuery] = useState(initialQuery);
  const [pagingState, setPagingState] = useState({
    page: 0,
    limit: 10,
  });

  //Collapse the row
  const [openRow, setRowOpen] = React.useState(null);
  const handleOpenRow = (row) => {
    if (row !== openRow) {
      setRowOpen(row);
    } else {
      setRowOpen(null);
    }
  };

  const handleClose = () => {
    setOpenAddInventoryDialog(false);
  };
  const [reload, setReload] = useState(true);
  const handleClickOpen = () => {
    setOpenAddInventoryDialog(true);
  };

  // Category
  const [openCategory, setOpenCategory] = useState(false);
  const handleClickOpenCategory = () => {
    setOpenCategory(true);
  };
  const handleCloseCategory = () => {
    setOpenCategory(false);
  };

  useEffect(() => {
    setPagingState({ ...pagingState, page: 0 });
  }, [reload, store_uuid, branch_uuid, query]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await trackPromise(
          productApi.getProductsOfBranch(store_uuid, branch_uuid, {
            page: pagingState.page,
            limit: pagingState.limit,
            ...query,
          })
        );
        setTotalRows(response.total_rows);
        setProductList(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (store_uuid && branch_uuid) {
      loadData();
    }
  }, [pagingState.page, pagingState.limit, branch_uuid, reload, query]);

  //const tableRef = React.createRef();
  // toolbar
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  /// import product by file
  const [openProductImportPopper, setOpenProductImportPopper] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [productErrors, setProductErrors] = useState([]);
  return (
    <Card className={classes.root}>
      <Grid container direction="row" justifyContent="space-between">
        <Typography className={classes.headerTitle} variant="h5">
          Sản phẩm
        </Typography>

        <Grid className={classes.btngroup} sx={{ padding: "10px" }}>
          <Tooltip title="Thiết lập danh mục">
            <Button
              variant="outlined"
              color="primary"
              className={classes.button}
              startIcon={<FileCopyIcon />}
              onClick={handleClickOpenCategory}
            >
              Danh mục
            </Button>
          </Tooltip>

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

          <Category open={openCategory} handleClose={handleCloseCategory} />
        </Grid>
      </Grid>
      <Category open={openCategory} handleClose={handleCloseCategory} />
      {openAddInventoryDialog && (
        <AddInventory
          open={openAddInventoryDialog}
          handleClose={handleClose}
          setReload={() => setReload(!reload)}
        />
      )}
      {/* Noti */}
      <SnackBar
        openBar={openBar}
        handleCloseBar={handleCloseBar}
        addStatus={addStatus}
      />
      <ToolBar
        textSearch={"Mã , Tên sản phẩm,..."}
        dataTable={productList}
        tableType={TableType.INVENTORY}
        handlePrint={handlePrint}
        handleSearchValueChange={setSearchValue}
        handleToggleFilter={handleToggleFilter}
        hasImport={true}
        importByJSON={importProductByJSON}
        excel_data={excel.excel_data_product}
        excel_name={excel.excel_name_product}
        customizable={true}
        customExcel={CustomExcel}
        columnsToKeep={[
          { dbName: "product_code", displayName: "Mã sản phẩm" },
          { dbName: "name", displayName: "Sản phẩm" },
          { dbName: "bar_code", displayName: "Mã vạch" },
          { dbName: "list_price", displayName: "Giá bán" },
          { dbName: "standard_price", displayName: "Giá vốn" },
          { dbName: "quantity_per_unit", displayName: "Đơn vị" },
          { dbName: "category_id", displayName: "Danh mục" },
          { dbName: "img_urls", displayName: "Hình ảnh (url1, url2,...)" },
          { dbName: "quantity_available", displayName: "Tồn kho" },
          { dbName: "min_reorder_quantity", displayName: "Tồn nhỏ nhất" },
          { dbName: "max_order", displayName: "Tồn lớn nhất" },
          { dbName: "has_batches", displayName: "Lô" },
          { dbName: "desciption", displayName: "Mô tả" },
        ]}
        orderByOptions={
          store_setting?.inventory.status
            ? [
                { value: "products.created_at", label: "Ngày tạo" },
                { value: "products.list_price", label: "Gia ban" },
                { value: "products.standard_price", label: "Gia von" },
                { value: "products.quantity_available", label: "Ton kho" },
              ]
            : [
                { value: "products.created_at", label: "Ngày tạo" },
                { value: "products.list_price", label: "Gia ban" },
                { value: "products.standard_price", label: "Gia von" },
              ]
        }
        orderBy={query.orderBy}
        setOrderBy={(value) => setQuery({ ...query, orderBy: value })}
        sort={query.sort}
        setSort={(value) => setQuery({ ...query, sort: value })}
        searchKey={query.searchKey}
        setSearchKey={(value) => setQuery({ ...query, searchKey: value })}
        handleRemoveFilter={handleRemoveFilter}
      />
      <LoadingIndicator />
      <TableWrapper
        pagingState={{ ...pagingState, total_rows: totalRows }}
        setPagingState={setPagingState}
        list={productList}
        tableRef={null}
      >
        <TableHeader
          classes={classes}
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
          headerData={

            store_type === 'fb' ? HeadCells.FBInventoryHeadCells : 
            store_setting?.inventory.status
              ? HeadCells.InventoryHeadCells
              : HeadCells.InventoryHeadCells.filter(
                  (item) => item.id !== "inventory" && item.id !== "quantity"
                )
          }
        />
        <TableBody>
          {productList.map((row, index) => {
            return (
              <InventoryTableRow
                key={row.uuid}
                row={row}
                setReload={() => setReload(!reload)}
                openRow={openRow}
                handleOpenRow={handleOpenRow}
                isManageInventory={store_setting?.inventory.status}
              />
            );
          })}
        </TableBody>
      </TableWrapper>
    </Card>
  );
}
