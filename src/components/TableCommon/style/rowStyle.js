import { makeStyles, useTheme,withStyles ,} from "@material-ui/core/styles";
import { grey, red} from '@material-ui/core/colors'

export default makeStyles((theme)=>({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  rowClicked:{
    //backgroundColor: theme.customization.mode === "Light" ? theme.palette.secondary.light : theme.palette.secondary.main ,
    backgroundColor: theme.customization.mode === "Light" ?grey[200] : grey[700] ,
    
  },
  row:{
    cursor : "pointer",
    width : "100%",
    '&:hover': {
      // backgroundColor: theme.customization.mode === "Light" ? theme.palette.secondary.light : theme.palette.secondary.main ,
      backgroundColor: theme.customization.mode === "Light" ?grey[200] : red[700] ,
    },
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  fontName:{
    fontWeight: 450,
  }
}));