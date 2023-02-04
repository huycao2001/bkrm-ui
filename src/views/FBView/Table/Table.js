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
    </Card>
  );
}

Table.propTypes = {};

export default Table;
