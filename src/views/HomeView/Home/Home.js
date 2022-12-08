import React, { useEffect, useState } from "react";
import { useTheme, makeStyles, createStyles } from "@material-ui/core/styles";
import useStyles from "../../../components/TableCommon/style/mainViewStyle";
//import library
// import {
//   Box,
//   Grid,
//   Collapse,
//   Typography,
//   ListItemIcon,
//   ListItemText,
//   IconButton,
// } from "@material-ui/core";
import Button from '@mui/material/Button';
import CreateIcon from '@mui/icons-material/Create';
import avaUpload from "../../../assets/img/product/img.jpeg";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { useDispatch, useSelector } from "react-redux";
import { TableCell, TableRow, Avatar, ListItem, Chip } from "@material-ui/core";
import clsx from "clsx";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import DialogWrapper from "../../../components/Modal/DialogWrapper";
import { Cancel, CheckCircle, Close, Error } from "@material-ui/icons";
import { VNDFormat } from "../../../components/TextField/NumberFormatCustom";

import BasicCard from "./BasicCard";

const Home = (props) => {
  const { open, handleClose, user, index, handleToggle } = props;

  const theme = useTheme();
  const classes = useStyles(theme);
  const xsScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const [confirmOpen, setConfirmOpen] = useState(false);
  const handleOpenConfirm = () => {
    setConfirmOpen(true);
  };
  const handleCloseConfirm = (status) => {
    setConfirmOpen(false);
  };

  useEffect(() => {
    if (!open) {
      handleCloseConfirm();
    }
  }, [open])
  return (
    <BasicCard>
    </BasicCard>
  )
}

export default Home;