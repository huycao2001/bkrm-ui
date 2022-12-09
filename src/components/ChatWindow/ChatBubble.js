// credits to masanori

import React from "react";
import { createStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import { deepOrange } from "@material-ui/core/colors";
import { Typography } from "@material-ui/core";
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme) =>
  createStyles({
    messageRow: {
      display: "flex"
    },
    messageRowRight: {
      display: "flex",
      justifyContent: "flex-end"
    },
    messageBlue: {
      position: "relative",
      marginLeft: "20px",
      marginBottom: "10px",
      padding: "10px",
      backgroundColor: "#A8DDFD",
      // width: "100%",
      //height: "50px",
      textAlign: "left",
      font: "400 .9em 'Open Sans', sans-serif",
      border: "1px solid #97C6E3",
      borderRadius: "10px",
      "&:after": {
        content: "''",
        position: "absolute",
        width: "0",
        height: "0",
        borderTop: "15px solid #A8DDFD",
        borderLeft: "15px solid transparent",
        borderRight: "15px solid transparent",
        top: "0",
        left: "-15px"
      },
      "&:before": {
        content: "''",
        position: "absolute",
        width: "0",
        height: "0",
        borderTop: "17px solid #97C6E3",
        borderLeft: "16px solid transparent",
        borderRight: "16px solid transparent",
        top: "-1px",
        left: "-17px"
      }
    },
    messageOrange: {
      position: "relative",
      marginRight: "20px",
      marginBottom: "10px",
      padding: "10px",
      backgroundColor: "#f8e896",
      // width: "60%",
      //height: "50px",
      textAlign: "left",
      font: "400 .9em 'Open Sans', sans-serif",
      border: "1px solid #dfd087",
      borderRadius: "10px",
      "&:after": {
        content: "''",
        position: "absolute",
        width: "0",
        height: "0",
        borderTop: "15px solid #f8e896",
        borderLeft: "15px solid transparent",
        borderRight: "15px solid transparent",
        top: "0",
        right: "-15px"
      },
      "&:before": {
        content: "''",
        position: "absolute",
        width: "0",
        height: "0",
        borderTop: "17px solid #dfd087",
        borderLeft: "16px solid transparent",
        borderRight: "16px solid transparent",
        top: "-1px",
        right: "-17px"
      }
    },

    messageContent: {
      padding: 0,
      margin: 0
    },
    messageTimeStampRight: {
      position: "absolute",
      fontSize: ".85em",
      fontWeight: "300",
      marginTop: "10px",
      bottom: "-3px",
      right: "5px"
    },

    orange: {
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: deepOrange[500],
      width: theme.spacing(4),
      height: theme.spacing(4)
    },
    avatarNothing: {
      color: "transparent",
      backgroundColor: "transparent",
      width: theme.spacing(4),
      height: theme.spacing(4)
    },
    displayName: {
      marginLeft: "20px"
    }
  })
);

export default function ChatBubble(props) {
  const message = props.data.message ? props.data.message : "Not set";
  const timestamp = props.data.timestamp ? props.data.timestamp : "Not set";
  const photoURL = props.data.photoURL ? props.data.photoURL : undefined;
  const displayName = props.data.displayName ? props.data.displayName : "Not set";
  const myMessage = props.data.myMessage;
  return (
    myMessage ?
      <ChatBubbleRight message={message} timestamp={timestamp} photoURL={photoURL} displayName={displayName} ></ChatBubbleRight>
      : <ChatBubbleLeft message={message} timestamp={timestamp} photoURL={photoURL} displayName={displayName}></ChatBubbleLeft>
  );
};

//avatarが左にあるメッセージ（他人）
const ChatBubbleLeft = (props) => {
  const message = props.message;
  const timestamp = props.timestamp;
  const photoURL = props.photoURL;
  const displayName = props.displayName;

  const theme = useTheme();
  const classes = useStyles(theme);
  return (
    <>
      <div className={classes.messageRow}>
        <Avatar
          alt={displayName}
          className={classes.orange}
          src={photoURL}
        ></Avatar>
        <div>
          <div className={classes.displayName}>{displayName}</div>
          <Tooltip title={timestamp}>
            <div className={classes.messageBlue}>
              <div>

                <Typography className={classes.messageContent} style={{ overflowWrap: 'break-word' }} variant="body1" gutterBottom component="div">{message}</Typography>
              </div>
              {/* <div className={classes.messageTimeStampRight}>{timestamp}</div> */}
            </div>
          </Tooltip>
        </div>
      </div>
    </>
  );
};
//avatarが右にあるメッセージ（自分）
const ChatBubbleRight = (props) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const message = props.message;
  const timestamp = props.timestamp;
  return (
    <div className={classes.messageRowRight}>
      <Tooltip title={timestamp}>
        <div className={classes.messageOrange}>
          <Typography className={classes.messageContent} style={{ overflowWrap: 'break-word' }} variant="body1" gutterBottom component="div">{message}</Typography>
          {/* <div className={classes.messageTimeStampRight}>{timestamp}</div> */}
        </div>
      </Tooltip>
    </div >
  );
};
