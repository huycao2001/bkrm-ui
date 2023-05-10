import React, {useState,useEffect} from 'react'
import {useTheme, makeStyles,withStyles,createStyles,lighten} from "@material-ui/core/styles";

import useStyles from "../../../../components/TableCommon/style/mainViewStyle";

import metabaseApi from '../../../../api/metabaseApi';

import { statusAction } from '../../../../store/slice/statusSlice';
import {
  Typography,
  Divider,
  Card,
  Grid,
  Paper,
  InputAdornment,
  Box,
  TextField,
  Button,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
import { grey, blue,purple} from '@material-ui/core/colors'
import { useSelector, useDispatch } from 'react-redux';

const StyledPaper = withStyles((theme) => ({
  root: {
    boxShadow:"none",
    background: theme.customization.mode === "Light"? null: grey[800],
    color: theme.customization.mode === "Light"? null: grey[700]
  },
}))(Paper);





export default function Metabase() {

  const theme = useTheme();
  const classes = useStyles(theme);
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState(null); 

  const user= useSelector((state) => state.info.user);


  const handleCreateMetabaseProfile = async () => { 
    try{
      const response = await metabaseApi.createMetabaseProfile(); 


      if(response.message == "success"){
        dispatch(statusAction.successfulStatus("Tạo tài khoản thành công !"));

        if(response.user){
          setUserInfo({
            email : response.user.email,
            password : response.user.password
          })
        }
      }else{
        dispatch(statusAction.successfulStatus(response.error));

      }
    }catch(e){
      dispatch(statusAction.failedStatus("Tạo tài khoản thất bại !"));

    }
  }



  const handleSyncMetabaseDate = async () => { 
    try{
      const response = await metabaseApi.syncMetabaseData(); 


      if(response.message == "success"){
        dispatch(statusAction.successfulStatus("Đồng bộ dữ liệu thành công !"));
      }else{
        dispatch(statusAction.successfulStatus(response.error));

      }
    }catch(e){
      dispatch(statusAction.failedStatus("Đồng bộ dữ liệu thất bại !"));

    }
  }

  return (
    <Card className={classes.root}>
      <Grid container direction="row" justifyContent="space-between" style = {{margin : "20px"}}>
        {/* 1. ADD POP UP */}
        <Typography className={classes.headerTitle} variant="h5">
          Thiết lập kinh doanh thông minh
        </Typography>


        <StyledPaper style={{width: '100%', marginBottom: theme.spacing(2)}}>
          <Grid direction='column'>
              <Box >
                Bước 1 : Tạo tài khoản, tên đăng nhập là email của bạn
                <Button
                  color = "primary"
                  variant = "outlined"
                  style = {{margin : "10px"}}
                  onClick = {handleCreateMetabaseProfile}
                >
                  Tạo tài khoản
                </Button>
              </Box>


              <Box>
                Bước 2 : Đồng bộ hóa dữ liệu của bạn để BI luôn có dữ liệu mới nhất
                <Button
                  color = "primary"
                  variant = "outlined"
                  style = {{margin : "10px"}}
                  onClick = {handleSyncMetabaseDate}
                >
                  Đồng bộ dữ liệu
                </Button>
              </Box>


              <Box>
                Bước 3 : Truy cập hệ thống kinh doanh thông minh

                <Button
                  color = "primary"
                  variant = "outlined"
                  style = {{margin : "10px"}}
                  onClick={() =>{
                    window.open(process.env.REACT_APP_METABASE_HOST, "_blank");
                  }}
                >
                  Truy cập 
                </Button>
              </Box>


              <Grid container direction='column' justifyContent = 'flex-start'>
                Thông tin truy cập
                <Grid item> 
                    Email: {user.email}
                </Grid>

                <Grid item>
                  Password: *******
                </Grid>

              </Grid>
          </Grid>

            
        </StyledPaper>
      </Grid>
      </Card>
  )
}
