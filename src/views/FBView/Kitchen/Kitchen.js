import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import { useState } from 'react';
import { AppBar, Box, Button, Grid, Tabs, Tab, Typography, TableContainer, Card, CardActionArea, CardContent, Paper } from '@material-ui/core';
import imageSrc1 from "../../../../src/assets/img/product/1.jpg";
import imageSrc2 from "../../../../src/assets/img/product/199.jpg";
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={0} paddingLeft={1} marginTop={1}>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

const sample = {
    "id": 1,
    "name": "Lemon Juice",
    "status": "Mang về",
    "time": "3 phút trước bởi Huy Cao",
    "imagePath": { imageSrc1 },
}

// const waitingForCooking = [
//     {
//         "id": 1,
//         "name": "Lemon Juice",
//         "status": "Mang về",
//         "time": "3 phút trước bởi Huy Cao",
//         "imagePath": { imageSrc1 },
//         "quantity": 5
//     },
//     {
//         "id": 2,
//         "name": "Mì",
//         "status": "Mang về",
//         "time": "3 phút trước bởi Huy Cao",
//         "imagePath": { imageSrc2 },
//         "quantity": 6
//     },
//     {
//         "id": 3,
//         "name": "Mì",
//         "status": "Mang về",
//         "time": "3 phút trước bởi Huy Cao",
//         "imagePath": { imageSrc2 },
//         "quantity": 7
//     },
//     {
//         "id": 4,
//         "name": "Mì",
//         "status": "Mang về",
//         "time": "3 phút trước bởi Huy Cao",
//         "imagePath": { imageSrc2 },
//         "quantity": 8
//     },
// ];




function Kitchen() {
    const [tab, setTab] = useState(0);
    const [waitingForCooking, setWaitingForCooking] = useState([
        {
            "id": 1,
            "name": "Lemon Juice",
            "status": "Mang về",
            "time": "3 phút trước bởi Huy Cao",
            "imagePath": { imageSrc1 },
            "quantity": 5
        },
        {
            "id": 2,
            "name": "Mì",
            "status": "Mang về",
            "time": "3 phút trước bởi Huy Cao",
            "imagePath": { imageSrc2 },
            "quantity": 6
        },
        {
            "id": 3,
            "name": "Rượu",
            "status": "Mang về",
            "time": "3 phút trước bởi Huy Cao",
            "imagePath": { imageSrc2 },
            "quantity": 7
        },
        {
            "id": 4,
            "name": "Mì",
            "status": "Mang về",
            "time": "3 phút trước bởi Huy Cao",
            "imagePath": { imageSrc2 },
            "quantity": 8
        },
        {
            "id": 5,
            "name": "Cocktail",
            "status": "Mang về",
            "time": "3 phút trước bởi Huy Cao",
            "imagePath": { imageSrc2 },
            "quantity": 2
        },
    ]);
    const [waitingForSupply, setWaitingForSupply] = useState([]);
    function handleAddOne(index) {
        // waitingForCooking[index].quantity = waitingForCooking[index].quantity - 1;
        let res = waitingForCooking;
        res[index].quantity = res[index].quantity - 1;





        var idxx;
        const checkExist = waitingForSupply.some(function (element, idx) {
            idxx = idx;
            return element.id === waitingForCooking[index].id;
        });
        if (checkExist) {
            let temp = waitingForSupply;
            temp[idxx].quantity++;
            setWaitingForSupply(temp);
        } else {
            console.log("else");
            let arr = waitingForSupply;
            let temp = Object.assign({}, waitingForCooking[index]);
            temp.quantity = 1;
            arr.push(temp);
            setWaitingForSupply(arr);
        }

        if (res[index].quantity == 0) {
            res.splice(index, 1);
        }
        setWaitingForCooking([...res]);
        // console.log("konbanwa");

    }

    function handleAddAll(index) {
        let item = waitingForCooking[index];
        let arr1 = waitingForCooking;
        let arr2 = waitingForSupply;

        var idxx;
        const checkExist = waitingForSupply.some(function (element, idx) {
            idxx = idx;
            return element.id === waitingForCooking[index].id;
        });

        if (checkExist) {
            let temp = waitingForSupply;
            temp[idxx].quantity += item.quantity;
            setWaitingForSupply([...temp]);
            arr1.splice(index, 1);
            setWaitingForCooking([...arr1]);
        } else {
            arr2.push(item);
            arr1.splice(index, 1);

            setWaitingForCooking([...arr1]);
            setWaitingForSupply([...arr2]);
        }


    }
    const handleChangeTab = (event, newTab) => {
        setTab(newTab);
    };


    const renderImageOption = () => {
        return (
            <>
                <TableContainer style={{ overflowX: 'hidden', maxHeight: '70vh', minHeight: '60vh' }}>
                    <Grid container spacing={1}>
                        {waitingForCooking.map((item, index) => {
                            //let findedItem= findItem(item)
                            return (
                                <Grid item xs={3} >
                                    <Card style={{ height: 320 }}>
                                        <CardContent style={{ margin: -5 }}>
                                            <Grid item xs={12} sm={12}>
                                                <Box sx={{ width: '100%', height: 200 }}>
                                                    <img src={item.imagePath.value} style={{ objectFit: 'cover', width: '100%', height: '60%' }}></img>
                                                    <Grid container justifyContent='center' >
                                                        <Grid item>
                                                            <Typography variant="h2" component="h2" color="primary">
                                                                {item.name}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid container>
                                                        <Grid item>
                                                            <Typography variant='caption'>
                                                                {item.status}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item>
                                                            <Typography variant='caption'>
                                                                {item.time}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item>
                                                            <Typography variant='caption'>
                                                                Số lượng: {item.quantity}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>


                                                    <Grid container justifyContent='center'>
                                                        <Grid item style={{ marginTop: 5 }}>
                                                            <Button style={{ fontSize: 10 }} fullWidth variant="contained" color="primary" onClick={() => {
                                                                handleAddOne(index);
                                                            }}>
                                                                Chế biến xong một
                                                            </Button>
                                                        </Grid>
                                                        <Grid item style={{ marginTop: 5 }}>
                                                            <Button style={{ fontSize: 10 }} fullWidth variant="contained" color="primary" onClick={() => {
                                                                handleAddAll(index);
                                                            }}>
                                                                Chế biến xong tất cả
                                                            </Button>
                                                        </Grid>
                                                    </Grid>



                                                </Box>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )
                        })}

                    </Grid>


                </TableContainer>
            </>
        );
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <Typography variant="h2">
                    Chờ chế biến
                </Typography>
                <Box bgcolor="white" color="secondary.contrastText" p={0} height={600}>
                    <AppBar position="static">
                        <Tabs value={tab} onChange={handleChangeTab} aria-label="simple tabs example">
                            <Tab label="ƯU TIÊN" {...a11yProps(0)} />
                            <Tab label="THEO MÓN" {...a11yProps(1)} />
                            <Tab label="THEO PHÒNG BÀN" {...a11yProps(2)} />
                        </Tabs>
                    </AppBar>
                    <TabPanel value={tab} index={0}>
                        <div>
                            {renderImageOption()}
                        </div>
                    </TabPanel>
                    <TabPanel value={tab} index={1}>
                        <div>
                            {renderImageOption()}
                        </div>
                    </TabPanel>
                    <TabPanel value={tab} index={2}>
                        Item Three
                    </TabPanel>
                </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Typography variant='h2'>
                    Đã xong/ chờ cung ứng
                </Typography>
                <Box bgcolor="info.main" color="info.contrastText" p={0} height={600} paddingLeft={1} paddingTop={1} paddingRight={1}>
                    <TableContainer style={{ overflowX: 'hidden', maxHeight: '78vh', minHeight: '60vh' }}>
                        <Grid container spacing={1}>
                            {waitingForSupply.map((item, index) => {
                                //let findedItem= findItem(item)
                                return (
                                    <Grid item xs={3} >
                                        <Card style={{ height: 320 }}>
                                            <CardContent style={{ margin: -5 }}>
                                                <Grid item xs={12} sm={12}>
                                                    <Box sx={{ width: '100%', height: 200 }}>
                                                        <img src={item.imagePath.value} style={{ objectFit: 'cover', width: '100%', height: '60%' }}></img>
                                                        <Grid container justifyContent='center' >
                                                            <Grid item>
                                                                <Typography variant="h2" component="h2" color="primary">
                                                                    {item.name}
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container>
                                                            <Grid item>
                                                                <Typography variant='caption'>
                                                                    {item.status}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item>
                                                                <Typography variant='caption'>
                                                                    {item.time}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item>
                                                                <Typography variant='caption'>
                                                                    Số lượng: {item.quantity}
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>


                                                        <Grid container justifyContent='center'>
                                                            <Grid item style={{ marginTop: 5 }}>
                                                                <Button style={{ fontSize: 10 }} fullWidth variant="contained" color="primary">
                                                                    Cung ứng một
                                                                </Button>
                                                            </Grid>
                                                            <Grid item style={{ marginTop: 5 }}>
                                                                <Button style={{ fontSize: 10 }} fullWidth variant="contained" color="primary" >
                                                                    Cung ứng tất cả
                                                                </Button>
                                                            </Grid>
                                                        </Grid>



                                                    </Box>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )
                            })}

                        </Grid>


                    </TableContainer>
                </Box>
            </Grid>
        </Grid>
    );
}

export default Kitchen;