import React from 'react'
import { useTheme, makeStyles, createStyles } from "@material-ui/core/styles";
import {
    Button,
    TextField,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    Grid,
    Avatar,
    Dialog,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Card,
    FormControlLabel,
    Checkbox,
    Divider,
    ButtonBase,
    Tooltip,
    CardHeader,
    Input,
    Chip,
    IconButton,
    FormLabel,
    RadioGroup,
    Radio
  } from "@material-ui/core";
import clsx  from "clsx"

import ModalWrapperWithClose from "../../../../components/Modal/ModalWrapperWithClose"
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) =>
    createStyles({

    weight:{
        fontWeight:500,
        color: "#000",
        fontSize: 14,
    },
    headerTitle: {
        fontSize: "1.125rem",
      },

})
);
const DiscountPopup = ({open,onClose,title,filteredPromotion,setSelectedPromotion,selectedPromotion}) => {
    const theme = useTheme();
  const classes = useStyles(theme);

  const [value, setValue] = React.useState(selectedPromotion?selectedPromotion.id.toString():null);
    const [promotion, setPromotion] =  React.useState(selectedPromotion? selectedPromotion:null);
  const handleChange = (promotion) => {
    if(promotion.id ===Number(value)){
        setValue(null);
        setPromotion(null)
        // setSelectedPromotion(null)
    }else{
        setValue(promotion.id.toString());
        setPromotion(promotion)
        // setSelectedPromotion(promotion)
    }
  };
    return (
        // <Dialog open={open} handleClose={onClose} title={title}>
        <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title" maxWidth="md" fullWidth={true}>
            <Grid container direction="row" justifyContent="space-between" alignItems="center">
                    <DialogTitle id="form-dialog-title">
                        <Typography className={classes.headerTitle} variant="h3" >
                            {title}
                        </Typography>
                    </DialogTitle>

                    <IconButton aria-label="close"   onClick={onClose}>
                        <CloseIcon  fontSize="small" />
                    </IconButton>
            </Grid>
           
            <DialogContent>
                <Grid  container direction="row" justifyContent="" style={{marginBottom:8}}>
                    <Grid item style={{width:10,marginRight:30}} >                      
                    </Grid>
                    <Grid item style={{width:250,marginRight:30}} >
                        <Typography className={clsx(classes.text,classes.weight)} >Chương trình khuyến mãi</Typography>
                    </Grid>
                    <Grid item style={{width:250, marginRight:30}}>
                        <Typography className={clsx(classes.text,classes.weight)} >Hình thức khuyến mãi</Typography>
                    </Grid>
                </Grid>
                <Divider style={{marginBottom:8}} />
                {/* // */}
                <FormControl component="fieldset">
                    <RadioGroup value={value} >
                        {filteredPromotion?.map((promotion) => {
                            console.log("promotion",promotion)
                            return (
                        
                                    <Grid  container direction="row" justifyContent="">
                                        <Grid item style={{width:10,marginRight:30}} >
                                            <FormControlLabel value={promotion.id.toString()} control={<Radio  size="small" onClick={()=>handleChange(promotion)}/>}  />
                                        </Grid>
                                        <Grid item style={{width:250,marginRight:30,marginTop:10, color:"#383737"}} >
                                            <Typography >{promotion.name}</Typography>
                                        </Grid>
                                        <Grid item style={{width:250, marginRight:30,marginTop:10,color:"#383737"}}>
                                            <Typography  >{promotion.discountKey ==="invoice" ? "Hoá đơn" : "Sản phẩm"} - {getDiscountType(promotion.discountKey,promotion.discountType)}</Typography>
                                        </Grid>
                                        <Grid item style={{width:250, marginRight:30,marginTop:10,color:"#383737"}}>
                                            <Typography  >Giảm giá {promotion.discountValue.toLocaleString()} {promotion.type} {"\u00a0\u00a0"}(Hoá đơn từ {promotion.totalCost.toLocaleString()} đ) </Typography>
                                        </Grid>
                                    </Grid>      
                            )})}
                    <Divider />
                </RadioGroup>
            </FormControl> 
                
            </DialogContent>
            <DialogActions>
        <Button
          onClick={onClose}
          variant="contained"
          size="small"
          color="secondary"
        >
          Huỷ
        </Button>
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={()=>{setSelectedPromotion(promotion);onClose()}}
        >
          Áp dụng
        </Button>
      </DialogActions>
  
              
        </Dialog>
    )
}

export default DiscountPopup

function getDiscountType (discountKey, discountType){

    if(discountKey === "invoice"){
        if(discountType ==="sendGift"){return "Tặng hàng"}
        else if (discountType ==="sendVoucher"){ return "Tặng voucher"}
        else{ return "Giảm giá hoá đơn"}
    }else{
        if(discountType ==="sendGift"){return "Mua hàng tặng hàng"}
        else{return "Giá bán theo số lượng mua"}
    }
}