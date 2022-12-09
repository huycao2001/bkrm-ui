// credits to masanori

import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import SendIcon from '@material-ui/icons/Send';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) =>
  createStyles({
    wrapForm: {
      display: "flex",
      justifyContent: "center",
      width: "95%",
      margin: `${theme.spacing(0)} auto`
    },
    wrapText: {
      width: "100%"
    },
    button: {
      //margin: theme.spacing(1),
    },
  })
);

export default function ChatInput(props) {
  const theme = useTheme();
  const classes = useStyles(theme);
  const handleSend = props.handleSend;
  const [textMessage, setTextMessage] = useState("");

  const handleSubmit = () => {
    handleSend(textMessage);
    setTextMessage(textMessage => "");
    return true;
  }
  return (
    <>
      <form className={classes.wrapForm} noValidate autoComplete="off">
        <TextField
        
          // value={textMessage}
          id="standard-text"
          label="Please type something"
          className={classes.wrapText}
          value={textMessage}
          onChange={(e) => {
            setTextMessage(e.target.value);
          }}
          onKeyPress={e => e.key === 'Enter' && handleSubmit() && e.preventDefault()}
        //margin="normal"
        />
        <Button
          onClick={() => { handleSubmit(); }}
          variant="contained" color="primary" className={classes.button}>
          <SendIcon />
        </Button>
      </form>
    </>
  )
}



