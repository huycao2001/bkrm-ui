
// import React from react; 

import { useDispatch, useSelector } from "react-redux";
import useStyles from "../../../components/TableCommon/style/mainViewStyle";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import productApi from '../../../api/productApi'
import Category from "./Category/Category";
import { useState, useEffect, React } from "react";
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
    Box
} from "@material-ui/core";

import AddIcon from '@mui/icons-material/Add';
import AddInventory from "./AddInventory/AddInventory";


export default function Inventory() {
    const [productList, setProductList] = useState([]);

    //Redux
    const infoDetail = useSelector((state) => state.info);
    const store_uuid = infoDetail.store.uuid;
    const branch_uuid = infoDetail.branch.uuid;

    const theme = useTheme();
    const classes = useStyles(theme);
    const xsScreen = useMediaQuery(theme.breakpoints.down("xs"));
    const [openAddInventoryDialog, setOpenAddInventoryDialog] = useState(false);
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
            const response = await productApi.getProductsOfBranch(
              store_uuid,
              branch_uuid,
              {
                page: pagingState.page,
                limit: pagingState.limit,
                ...query,
              }
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





    return (
        <Card className={classes.root} >
            <Grid container direction="row" justifyContent="space-between">
                <Typography className={classes.headerTitle} variant="h5" >
                    Sản phẩm
                </Typography>

                <Grid>
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
                            className={classes.button}
                            startIcon={<AddIcon />}
                            onClick={handleClickOpen}
                        >
                            Thêm
                        </Button>
                    </Tooltip>


                    <Category open={openCategory} handleClose={handleCloseCategory} />


                    {/* <Button
              variant="outlined"
              color="primary"
              className={classes.button}
              onClick={handleClickRecommend}
            >
              Gợi ý đặt hàng
            </Button> */}

                    {/* <ButtonBase sx={{ borderRadius: "16px" }}>
            <Avatar variant="rounded" className={classes.headerAvatar}>
              <Tooltip title="Thêm sản phẩm">
                <AddIcon stroke={1.5} size="1.3rem" />
              </Tooltip>
            </Avatar>
          </ButtonBase> */}
                </Grid>

            </Grid>


            <AddInventory
                open={openAddInventoryDialog}
                handleClose={handleClose}
                setReload={() => setReload(!reload)}
            />
        </Card>
    );
};