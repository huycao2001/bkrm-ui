
// import React from react; 

import useStyles from "../../../components/TableCommon/style/mainViewStyle";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useState } from "react";
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
    const theme = useTheme();
    const classes = useStyles(theme);
    const xsScreen = useMediaQuery(theme.breakpoints.down("xs"));
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const handleClose = () => {
        setOpenAddDialog(false);
    };
    const [reload, setReload] = useState(true);
    const handleClickOpen = () => {
        setOpenAddDialog(true);
    };
    console.log("Inventory is called")
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
                            startIcon = {<FileCopyIcon/>}
                        >
                            Danh mục
                        </Button>
                    </Tooltip>

                    <Tooltip title="Thêm hàng hóa mới">
                        <Button
                            variant="outlined"
                            color="primary"
                            className={classes.button}
                            startIcon={<AddIcon/>}
                            onClick={handleClickOpen}
                        >
                            Thêm
                        </Button>
                    </Tooltip>

                   
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
          open={openAddDialog}
          handleClose={handleClose}
          setReload={() => setReload(!reload)}
        />
        </Card>
    );
};