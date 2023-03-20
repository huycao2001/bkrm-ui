import React from "react";
import { createStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import { Paper, Drawer, Fab, Box } from "@material-ui/core";
import ChatInput from "./ChatInput";
import ChatBubble from "./ChatBubble";
import { useState } from "react";
import { useEffect } from "react";
import messageApi from "../../api/messageApi";
import { useSelector } from "react-redux";
import { useRef } from "react";
import { MessageOutlined } from "@material-ui/icons";
import Echo from "laravel-echo";

const useStyles = makeStyles((theme) =>
  createStyles({
    paper: {
      width: "80vw",
      height: "8100vh",
      maxWidth: "500px",
      maxHeight: "100%",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      position: "relative"
    },
    paper2: {
      width: "80vw",
      maxWidth: "500px",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      position: "relative"
    },
    container: {
      width: "100vw",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    messagesBody: {
      width: "calc( 100% - 20px )",
      margin: 10,
      overflowY: "scroll",
      height: "calc( 100% - 80px )"
    },
    fab: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  })
);

export default function ChatWindow() {
  const theme = useTheme();
  const classes = useStyles(theme);
  const info = useSelector((state) => state.info);
  let user_uuid = info.user.uuid;
  let store_uuid = info.store.uuid;
  const branch_uuid = info.branch.uuid;
  const scrollRef = useRef(null);
  const [drawerOpen, setDrawerOpen] = useState(true);
  let ws = new WebSocket(`ws://localhost:6001/app/apollo13?protocol=7&client=js&version=7.5.0&flash=false`);
  ws.onopen = function (event) {
    wsIsGood = true;
  };
  let wsIsGood = false;

  const placeholderMessages = [
    { message: "This is a test.", timestamp: "Today", photoURL: "", displayName: "Diavolo", myMessage: false, key: 1 },
    { message: "Wouldn't you agree, Jean Pierre Polnareff?", timestamp: "Today", photoURL: "", displayName: "Diavolo", myMessage: false, key: 2 },
    { message: "Did you just skip your own dialogue?", timestamp: "Today", photoURL: "", displayName: "Jean Pierre Polnareff", myMessage: true, key: 3 },
  ]

  const [messages, setMessages] = useState([]);
  // const [messages, setMessages] = useState(placeholderMessages);

  const handleSendMessage = (message) => {
    sendWsData(message);
  }

  const handleReceiveNewMessage = (payload) => {
    setMessages(messages => messages.concat([{ message: payload.temporary_fborder, timestamp: payload.timestamp, photoURL: "", displayName: payload.table_uuid, myMessage: (true), key: messages.length + 1 }]));
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  }

  const openDrawer = () => {

    setDrawerOpen(true);
  }


  const closeDrawer = () => {

    setDrawerOpen(false);
  }


  const sendWsData = (data) => {
    try {
      if (ws.OPEN) {
        ws.send(JSON.stringify(
          {
            event: 'bkrm:temporary_table_fborder_updated',
            token: localStorage.getItem("token"),
            payload: {
              table_uuid: 'f7204b10-20c2-409f-b06c-ef36db0636c4',
              temporary_fborder: data
            },
          }), []);
      }
    }
    catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    window.Echo = new Echo({
      broadcaster: 'pusher',
      key: process.env.REACT_APP_PUSHER_APP_KEY,
      wsHost: process.env.REACT_APP_PUSHER_URL,
      wsPort: process.env.REACT_APP_PUSHER_PORT,
      wssPort: process.env.REACT_APP_PUSHER_PORT,
      forceTLS: false,
      disableStats: true,
      encrypted: false,
      enabledTransports: ['ws', 'wss'],
      // cluster: 'mt1',
    });
    const channel = `ws.stores.${store_uuid}.branches.${branch_uuid}.tables.f7204b10-20c2-409f-b06c-ef36db0636c4`;
    // const channel = `ws/stores/${store_uuid}/branches/${branch_uuid}/tables/f7204b10-20c2-409f-b06c-ef36db0636c4`;
    // if (!window.Echo.channel(channel)) {
    if (true) {
      let c = window.Echo.channel(channel);

      c.subscribed(() => {
        console.log('Now listening to events from channel: ' + channel);

      });
      c.listen('TemporaryTableOrderUpdatedEvent', (data) => {
        console.log("WS got: " + JSON.stringify(data));
        handleReceiveNewMessage(data);
      });
    }
  }, []);

  return (
    <React.Fragment>
      <Fab color="primary" classes={classes.fab} aria-label="add" onClick={openDrawer}>
        <MessageOutlined />
      </Fab>
      <Drawer open={drawerOpen} anchor="right" onClose={() => { closeDrawer(); }}>
        <Paper className={classes.paper} zdepth={2}>
          <Paper id="style-1" className={classes.messagesBody}>
            {messages.map((message) => (
              <ChatBubble key={message.key} data={message}></ChatBubble>
            ))}
            <div ref={scrollRef} />
          </Paper>
          <ChatInput handleSend={handleSendMessage} />
        </Paper>
      </Drawer>
    </React.Fragment>
  );
}
