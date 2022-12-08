import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useSelector } from 'react-redux';

import { useTheme, makeStyles, createStyles } from "@material-ui/core/styles";
import useStyles from "../../../components/TableCommon/style/mainViewStyle";
import { Grid, Paper } from '@material-ui/core';
import { useState } from 'react';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

export default function BasicCard() {

  const info = useSelector((state) => state.info);
  const store_info = info.store;
  const user_info = info.user;

  const datetimeOptions = {
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  };

  const [datetime, setDatetime] = useState(new Date().toLocaleDateString("vi-vn", datetimeOptions));

  React.useEffect(() => {
    setInterval(() => {
      setDatetime(new Date().toLocaleDateString("vi-vn", datetimeOptions));
    }, 1000);
  });

  const theme = useTheme();
  const classes = useStyles(theme);
  return (
    <Card className={classes.root}>
      <Box margin={1}>
        <CardContent>
          <Grid container direction="row" justifyContent="center" alignItems="center">
            <Grid item xs={6} sm={6}>
              <Typography variant="h4" color="text.secondary">
                Xin chào,
              </Typography>
              <Typography style={{ overflowWrap: 'break-word' }} variant="h4">
                {user_info.name}
              </Typography>
              <Typography variant="h4" color="text.secondary">
                từ cửa hàng
              </Typography>
              <Typography style={{ overflowWrap: 'break-word' }} variant="h4">
                {store_info.name}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6}>
              <Typography variant="h4" color="text.secondary">
                Bây giờ là
              </Typography>
              <Typography style={{ overflowWrap: 'break-word' }} variant="h4">
                {datetime}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Box>
    </Card>
  );
}
