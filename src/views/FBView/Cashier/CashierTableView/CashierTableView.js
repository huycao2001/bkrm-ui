// import React from 'react'
import PropTypes from 'prop-types';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

import clsx from "clsx";
import { grey } from "@material-ui/core/colors";
import LoadingIndicator from '../../../../components/LoadingIndicator/LoadingIndicator';
import {
  AppBar,
  Toolbar,
  Grid,
  Card,
  Box,
  Table,
  Tabs,
  Tab,
  TableContainer,
  CardContent,
  CardMedia,
  CardActionArea,
  FormControlLabel,
  Switch,
  Menu,
  MenuItem,
  ListItem,
  IconButton,
  TableBody,
  Typography,
  ButtonBase,
  AvatarTypeMap,
  Tooltip,
  Avatar,
  TableCell,
  TableRow,
  Button,
  TableHead,
} from "@material-ui/core";

import React, { useRef, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@material-ui/core/styles";
import useStyles from "../../../../components/TableCommon/style/mainViewStyle";

import { infoActions } from '../../../../store/slice/infoSlice';

function CashierTableView(props) {


    const theme = useTheme();
    const classes = useStyles(theme);
    const{
      tables,
      selectedTable,
      setSelectedTable
    } = props;

    const info = useSelector((state) => state.info);
    const store_uuid = info.store.uuid;
    const branch = info.branch;
    const branch_uuid = info.branch.uuid;





    const renderImageOption = () => {
      return (
        <>
        <LoadingIndicator/>
        <TableContainer style={{maxHeight: '64vh', minHeight:'60vh'}}>
        <Grid container spacing={2} >
        {tables.map((item, index) => {
            //let findedItem= findItem(item)
            return(
              <Grid item>
              <Card  className={clsx(classes.hoverCard,classes.item,classes.colorCard)} style={{ width:120, borderRadius:7,backgroundColor: selectedTable?.uuid === item.uuid ? theme.palette.primary.light : null }} >
                <CardActionArea  onClick={() => setSelectedTable(item)}>
                    <CardContent style={{margin:-5}}>
                        <Typography gutterBottom  style={{color:'#000', fontWeight:500, fontSize:Number(12)}}> {item.name} </Typography>
                        <Grid container alignItem='center'justifyContent='space-between'>
                        <Typography   className={classes.alignCenter} style={{color:'#000', fontWeight:'#000', fontSize:Number(12)}} >
                            {item.table_group_name}
                        </Typography>

                        
                        
                        </Grid>
                    </CardContent>   
              </CardActionArea>
          </Card>
          </Grid> 
          )})}
          
          
        </Grid>
        </TableContainer>
        
        </>
      );
    };
    
  return (




    <div>
      {renderImageOption()}
    </div>
  )
}




CashierTableView.propTypes = {}

export default CashierTableView;
