/**
 * Color intention that you want to used in your theme
 * @param {JsonObject} theme Theme customization object
 */

 import { purple } from '@mui/material/colors';

export default function themePalette(theme) {
  const level = theme.customization.colorLevel;
  return {
    primary: {
      light: theme.customization.primaryColor[level],
      main: theme.customization.primaryColor[400],
    },
    secondary: {
      light: theme.customization.secondaryColor[50],
      main: theme.customization.secondaryColor[500],
    },
    warning :{
      light :  theme.customization.secondaryColor[50],
      main :  theme.customization.secondaryColor[50]
    },
    
    text: {
      primary: theme.darkTextPrimary,
      secondary: theme.darkTextSecondary,
    },
    background: {
      paper: theme.paper,
      default: theme.paper,
    },
  };
}
