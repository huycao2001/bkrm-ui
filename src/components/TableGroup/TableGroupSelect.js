import React, { useState, useEffect, useRef } from "react";


import { useDispatch, useSelector } from "react-redux";
import { statusAction } from "../../store/slice/statusSlice";
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

import {Select, TreeSelect} from 'antd';
import AddIcon from "@material-ui/icons/Add";

import fbTableGroupApi from "../../api/fbTableGroup";


const TableGroupSelect = (props) => {
    const info = useSelector((state) => state.info);
    const store_uuid = info.store.uuid;
    const branch_uuid = info.branch.uuid;

    const [tableGroups, setTableGroups] = useState([]);

    useEffect(() => {

        const loadTableGroups = async() => {
            try{
                const response = await fbTableGroupApi.getTableGroupsOfBranch(store_uuid, branch_uuid);
                if(response.message === 'Success'){
                    const data = response.data; 
                    const groups = data.table_groups.map(group => {
                        return {
                            value : group.name, 
                            label : group.name
                        }
                    });
                    //console.log('Table groups ' + JSON.stringify(groups));
                    setTableGroups(groups);
                }
                //console.log('Table groups' +  JSON.stringify(response.data));
            }catch(e){
                console.log(e);
            }
        } 
        loadTableGroups();

    },[])

    return (
        <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        style = {{marginTop : '20px'}}
    >
        <Select
            defaultValue="Nhóm bàn chung"
            style={{ width: '50%'}}  
            dropdownStyle={{ maxHeight: 400, overflow: 'auto',zIndex:100000000  }}
            
            options={tableGroups}
        />

        <Tooltip title ='Thêm nhóm mới'>
            <IconButton>
                <AddIcon/>
            </IconButton>
        </Tooltip>
    </Grid>
    )
}

export default TableGroupSelect