import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import { blue, grey, red } from "@material-ui/core/colors";

export default makeStyles((theme) => ({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  rowClicked: {
    //backgroundColor: theme.customization.mode === "Light" ? theme.palette.secondary.light : theme.palette.secondary.main ,
    // backgroundColor:
    //   theme.customization.mode === "Light" ? grey[200] : grey[700],
    backgroundColor: theme.customization.primaryColor[400],
  },
  row: {
    cursor: "pointer",
    width: "100%",
    "&:hover": {
      // backgroundColor: theme.customization.mode === "Light" ? theme.palette.secondary.light : theme.palette.secondary.main ,
      // backgroundColor:
      //   theme.customization.mode === "Light" ? grey[200] : red[700],
      backgroundColor: theme.customization.primaryColor[400],
    },
  },
  // oddRow: {
  //   backgroundColor: grey[100],
  //   cursor: "pointer",
  //   width: "100%",
  //   "&:hover": {
  //     // backgroundColor: theme.customization.mode === "Light" ? theme.palette.secondary.light : theme.palette.secondary.main ,
  //     // backgroundColor:
  //     //   theme.customization.mode === "Light" ? grey[200] : red[700],
  //     backgroundColor: blue[100],
  //   },
  // },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  fontName: {
    fontWeight: 450,
  },
}));
