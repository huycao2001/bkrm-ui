import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import { useState, useEffect } from 'react';

import { useDispatch, useSelector } from "react-redux";

import orderApi from '../../../api/orderApi';

import { AppBar, Box, Button, Grid, Tabs, Tab, Typography, TableContainer, Card, CardActionArea, CardContent, Paper } from '@material-ui/core';
import imageSrc1 from "../../../../src/assets/img/product/1.jpg";
import imageSrc2 from "../../../../src/assets/img/product/199.jpg";


import { trackPromise } from "react-promise-tracker";

import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator';
import { statusAction } from '../../../store/slice/statusSlice';
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
    "table_name": "Mang về",
    "table_group_name": "3 phút trước bởi Huy Cao",
    "imagePath": { imageSrc1 },
}



function Kitchen() {


    // redux
    const dispatch = useDispatch();
    const info = useSelector((state) => state.info);
    const store_uuid = info.store.uuid;
    const branch = info.branch;
    const branch_uuid = info.branch.uuid;

    const [isLoadingFBOrders, setIsLoadingFBOrders] = useState(false);

    const [tab, setTab] = useState(0);
    const [waitingForCooking, setWaitingForCooking] = useState([]);
    const [waitingForSupply, setWaitingForSupply] = useState([]);


    useEffect(() => { 
        const loadFBOrders = async () => {
            try{
                setIsLoadingFBOrders(true);
                const response = await trackPromise(
                    orderApi.getFBOrders(store_uuid, branch_uuid,{
                        status : "pending"
                    })
                );


                if(response.message === "Orders fetched successfully"){
                    var fb_orders = response.data.fb_orders; 
                    var NewWaitingForCooking = []; 
                    fb_orders.map(fb_order => { 
                        
                        fb_order.fb_order_details.map(fb_order_detail =>{
                            NewWaitingForCooking = [
                            ...NewWaitingForCooking,    
                            {
                                id : fb_order_detail.id,
                                fb_order_uuid : fb_order.uuid,
                                name : fb_order_detail.product_name,
                                table_name : fb_order.table.name ,
                                table_group_name : fb_order.table.table_group.name, 
                                quantity: Number(fb_order_detail.ordered_quantity) - Number(fb_order_detail.prepared_quantity),
                                product_uuid : fb_order_detail.product_uuid

                            }
                            
                        ]
                        })


                        
                    });
                    console.log("me may " + JSON.stringify(NewWaitingForCooking))
                    setWaitingForCooking(NewWaitingForCooking);
                    setIsLoadingFBOrders(false);


                }else if(response.message){
                    console.log(response.message);
                    setIsLoadingFBOrders(false);
                }else{
                    console.log(response);
                    setIsLoadingFBOrders(false);
                }
            }catch(e){
                console.log("Get fb orders failed: " + e)
            }
        }

        loadFBOrders()

    }, [store_uuid, branch_uuid]);





    const  handleAddOne = async (index) =>  {
        // waitingForCooking[index].quantity = waitingForCooking[index].quantity - 1;

        try{
            let res = waitingForCooking;

            var items = [{
                product_uuid : res[index].product_uuid,
                quantity_to_prepare : 1
            }]

            const response = await orderApi.prepareFBOrder(store_uuid, branch_uuid, res[index].fb_order_uuid, {
                items : items
            }); 




            if(response.message === "success"){
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
                dispatch(statusAction.successfulStatus("Chuẩn bị món ăn thành công"));
            }else{
                dispatch(statusAction.failedStatus("Chuẩn bị món ăn thất bại"))
            }

        }catch(e){
            // dispatch(statusAction.failedStatus("Chuẩn bị món ăn thất bại"))
            console.log("Kitchen prepare fail " + e)
        }
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
                <TableContainer style={{ overflowX: 'hidden', maxHeight: '62vh', minHeight: '60vh' }}>
                    <Grid container spacing={1} style={{margin : "3px"}}>
                        {waitingForCooking.map((item, index) => {
                            //let findedItem= findItem(item)
                            return (
                                <Grid item xs={3} >
                                    <Box boxShadow={3}>
                                        <Card style={{ height: "100%", paddiing : "10px", border: '1px solid', borderColor: 'black' }}>
                                            <CardContent style={{ margin: -5 }}>
                                                <Grid item xs={12} sm={12}>
                                                    <Box sx={{ width: '100%', height: "100%" }}>
                                                        {/* <img src={item.imagePath.value} style={{ objectFit: 'cover', width: '100%', height: '60%' }}></img> */}
                                                        <Grid container justifyContent='center' >
                                                            <Grid item>
                                                                <Typography variant="h3" component="h3" color="primary">
                                                                    {item.name}
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid 
                                                            container
                                                            direction="column" 

                                                        >
                                                            <Grid item>
                                                                <Typography variant='caption'>
                                                                    {item.table_name}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item>
                                                                <Typography variant='caption'>
                                                                    {item.table_group_name}
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
                                    </Box>

                                </Grid>
                            )
                        })}

                    </Grid>


                </TableContainer>
            </>
        );
    };

    return (
        isLoadingFBOrders ? <LoadingIndicator/> : 
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
                <Box bgcolor="white" p={0} height={600} paddingLeft={2} paddingTop={2} paddingRight={2} border={2} borderColor="primary.main" borderRadius={16}>
                    <TableContainer style={{ overflowX: 'hidden', maxHeight: '62vh', minHeight: '60vh' }}>
                        <Grid container spacing={1}>
                            {waitingForSupply.map((item, index) => {
                                //let findedItem= findItem(item)
                                return (
                                    <Grid item xs={3} >
                                        <Box boxShadow={3}>
                                            <Card style={{ height: "100%" , border: '1px solid', borderColor: 'black'}}>
                                                <CardContent style={{ margin: -5 }}>
                                                    <Grid item xs={12} sm={12} direction="column" >
                                                        <Box sx={{ width: '100%', height: "100%" }} direction="column" >
                                                            {/* <img src={item.imagePath.value} style={{ objectFit: 'cover', width: '100%', height: '60%' }}></img> */}
                                                            <Grid container justifyContent='center' >
                                                                <Grid item>
                                                                    <Typography variant="h2" component="h2" color="primary">
                                                                        {item.name}
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid container direction="column" >
                                                                <Grid item>
                                                                    <Typography variant='caption'>
                                                                        {item.table_name}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item>
                                                                    <Typography variant='caption'>
                                                                        {item.table_group_name}
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
                                        </Box>

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