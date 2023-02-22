import React, { useState, useEffect, useRef } from "react";
import { useTheme, makeStyles, styled } from "@material-ui/core/styles";
import { 
    Button, 
    Grid, 
    TextField, 
    FormControl, 
    TableRow, 
    TableCell, 
    Divider, 
    TableBody, 
    Select, 
    MenuItem, 
    Typography,
    IconButton,
} from "@material-ui/core";

import InfoButton from "../../../../components/Button/InfoButton";
import TableWrapper from '../../../../components/TableCommon/TableWrapper/TableWrapper'
import TableHeader from '../../../../components/TableCommon/TableHeader/TableHeader'
import {ThousandFormat, ThousandSeperatedInput} from '../../../../components/TextField/NumberFormatCustom'
import DeleteForeverTwoToneIcon from '@material-ui/icons/DeleteForeverTwoTone';

import AddIcon from '@material-ui/icons/Add';




const useStyles = makeStyles((theme) => ({
    formControl: {
        marginRight: 10,
        minWidth: 220,
    },
    row: {
        margin: "15px 20px 10px 20px",
    }

}));




const  AddUnit = (props) =>  {
    const {
        unitList,
        setUnitList
    } = props;


    useEffect(() =>{
        console.log("unitList " + JSON.stringify(unitList));
    }, [unitList])
    const theme = useTheme();
    const classes = useStyles(theme);
    const handleAddNewUnit = ()=>{
        var newList = [...unitList];
        newList.push({
            name : '', 
            conversion_number : 0

        });
        setUnitList(newList);
    }


    const handleChangeUnit = (index, property, newValue) => {
        var newList = [...unitList];
        newList[index][property] = newValue;
        console.log('index' + index);
        console.log(JSON.stringify(newList[index]));
        setUnitList(newList);
    }

    const handleDeleUnit = (unitIndex) => {
        var newList = unitList.filter((unit, index) => {
            return index !== unitIndex
        }); 

        setUnitList(newList);
    }

    return (
        <div style={{margin : "10px"}}>
            <Button
                variant="outlined" 
                color="primary"
                size = 'small'
                style = {{marginLeft : '10px'}}
                onClick = {handleAddNewUnit}
                
            >
                Thêm 1 đơn vị mới
            </Button>

            <InfoButton
                title = 'Đơn vị quy đổi cho nguyên liệu'
            />
            
            {unitList.length > 0 && <TableWrapper isCart = {true} isUnitTable = {true}>
                <TableHeader
                        classes={classes}
                        headerData={UnitHeadCells}
                />
                <TableBody>
                    {unitList.map((row,index) => {
                        return (
                            <TableRow>
                                <TableCell align="center">
                                <TextField
                                    value={row.name}
                                    size = 'small'
                                    onChange={(e) =>
                                        handleChangeUnit(
                                            index,
                                            'name',
                                            e.target.value
                                        )
                                    }
                                />
                                
                                </TableCell>


                                <TableCell align="center">
                                    <ThousandSeperatedInput
                                        value={row.conversion_number}
                                        onChange={(e) =>{
                                            handleChangeUnit(
                                                index,
                                                "conversion_number",
                                                Math.abs(e.target.value)
                                            )}
                                        }
                                    />
                                </TableCell>

                                <TableCell align="center">
                                    <Typography>
                                        Cái
                                    </Typography>
                                </TableCell>

                                <TableCell align="center">
                                    <IconButton 
                                        size = 'small' 
                                        onClick = {
                                            () => handleDeleUnit(index)
                                        }
                                        >
                                        <DeleteForeverTwoToneIcon/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </TableWrapper>}

        </div>
    )
}



const UnitHeadCells = [
    { id: 'name', align: 'center', disablePadding: true, label: 'Tên đơn vị' },
    // { id: 'product_code', align: 'center', disablePadding: true, label: 'Mã hàng' }, 
    { id: 'conversion_number', align: 'center', disablePadding: true, label: 'Giá trị quy đổi' },
    { id: 'quantity_per_unit', align: 'center', disablePadding: true, label: 'Đơn vị trong kho' }
];


const unitList = [
    
];

export default AddUnit;


