import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
//import library
import { trackPromise } from "react-promise-tracker";

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
  ListItem,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  MenuItem,
} from "@material-ui/core";
import { TableGroupEditorItem } from "./TableGroupEditorItem";

import fbTableGroupApi from "../../api/fbTableGroup";
import { statusAction } from "../../store/slice/statusSlice";
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator";

const TableGroupEditor = (props) => {

    const {
        openTableGroupEditor,
        handleCloseTableGroupEditor,
        setReload
    } = props; 

    const [tableGroups, setTableGroups] = useState([]);
    const [reloadTableGroupEditor, setReloadTableGroupEditor] = useState(false);
    const dispatch = useDispatch();
    const info = useSelector((state) => state.info);
    const store_uuid = info.store.uuid;
    const branch_uuid = info.branch.uuid;

    useEffect(() => {
        //console.log("call this again")
        const loadTableGroups = async () => {
            try{
                const response = await trackPromise(
                    fbTableGroupApi.getTableGroupsOfBranch(store_uuid, branch_uuid)
                );
                console.log(JSON.stringify(response));
                if(response.message === 'Success'){
                    setTableGroups(response.data.table_groups);
                }else{
                    dispatch(statusAction.failedStatus("Vui lòng thử lại sau"));
                }
            }
            catch(e){
                dispatch(statusAction.failedStatus("Lỗi : Check console"));
                console.log(e);
            }

            
            
        }

        loadTableGroups();
    }, [branch_uuid, reloadTableGroupEditor])

  return (
    <Dialog open={openTableGroupEditor} onClose = {handleCloseTableGroupEditor}>
      <DialogTitle id="alert-dialog-title">
        <Typography variant="h3">Thiết lập nhóm bàn</Typography>
      </DialogTitle>
      <DialogContent
        style={{ width: "50vh", maxHeight: '50vh', overflowY: 'auto'}}
      >
        <LoadingIndicator/>
        {tableGroups.map(tableGroup => (
            <TableGroupEditorItem
                key = {tableGroup.uuid}
                tableGroup = {tableGroup}
                setReload = {setReload}
                setReloadTableGroupEditor = {() => setReloadTableGroupEditor(!reloadTableGroupEditor)}
            />
        ))}
        


      </DialogContent>
      <DialogActions>
        <Button
          color="secondary"
          variant="contained"
          size="small"
          onClick = {handleCloseTableGroupEditor}

        >
          Hủy
        </Button>

      </DialogActions>


    </Dialog>
  )
}



export default TableGroupEditor;
