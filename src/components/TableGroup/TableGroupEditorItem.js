import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
//import library

import CategoryIcon from "@material-ui/icons/Category";
import {
  Button,
  TextField,
  Typography,
  Grid,
  Box,
  InputAdornment,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Dialog,
  FormControlLabel,
  Switch,
  Collapse,
  Paper,
  Card,
  CardHeader,
  Checkbox,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from "@material-ui/core";

import UpdateTableGroup from "./UpdateTableGroup";

//import ListItemIcon from "@material-ui/core/ListItemIcon";


export const TableGroupEditorItem = (props) => {

    const {
        tableGroup,
        setReload,
        setReloadTableGroupEditor
    } = props;


    const [openTableGroupUpdate, setOpenTableGroupUpdate] = useState(false);

    const handleOpenTableGroupUpdate = () =>{
        setOpenTableGroupUpdate(true);
    }
    const handleCloseTableGroupUpdate = () =>{
        setOpenTableGroupUpdate(false);
    }
  return (
    <List>
        <UpdateTableGroup
            openTableGroupUpdate = {openTableGroupUpdate}
            handleCloseTableGroupUpdate = {handleCloseTableGroupUpdate}
            tableGroup = {tableGroup}
            setReload = {setReload}
            setReloadTableGroupEditor = {setReloadTableGroupEditor}
        />
      <ListItem >
        <ListItemText
          primary={
            <Tooltip  title="Cập nhật">
              <Button 
                style={{display:"flex",flexDirection:"row",justifyContent:"flex-start", textDecoration:"none",textTransform:"none"}} 
                onClick = {handleOpenTableGroupUpdate}
                fullWidth 
              >
                <ListItemIcon>
                  <CategoryIcon/>
                </ListItemIcon>
                {tableGroup.name}
              </Button>
            </Tooltip>
          }
        />

      </ListItem>


    </List>
  )
}
