import React from "react";
import { createStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import ChatInput from "./ChatInput";
import ChatBubble from "./ChatBubble";
import { useState } from "react";
import { useEffect } from "react";
import messageApi from "../../api/messageApi";
import { useSelector } from "react-redux";
import { useRef } from "react";
import { message } from "antd";

const useStyles = makeStyles((theme) =>
  createStyles({
    paper: {
      width: "80vw",
      height: "80vh",
      maxWidth: "500px",
      maxHeight: "700px",
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
    }
  })
);

export default function ChatWindow() {
  const theme = useTheme();
  const classes = useStyles(theme);
  const info = useSelector((state) => state.info);
  const user_uuid = info.user.uuid;
  const store_uuid = info.store.uuid;
  const branch_uuid = info.branch.uuid;
  const scrollRef = useRef(null);

  const placeholderMessages = [
    { message: "This is a test.", timestamp: "Today", photoURL: "", displayName: "Diavolo", myMessage: false, key: 1 },
    { message: "Wouldn't you agree, Jean Pierre Polnareff?", timestamp: "Today", photoURL: "", displayName: "Diavolo", myMessage: false, key: 2 },
    { message: "Did you just skip your own dialogue?", timestamp: "Today", photoURL: "", displayName: "Jean Pierre Polnareff", myMessage: true, key: 3 },
  ]

  const [messages, setMessages] = useState([]);
  // const [messages, setMessages] = useState(placeholderMessages);

  const handleSendMessage = async (message) => {
    try {
      let res = await messageApi.sendMessage(store_uuid, branch_uuid, user_uuid, message);
    }
    catch (e) {
      console.log(e);
    }
  }

  const handleReceiveNewMessage = (payload) => {
    // let newMessage = { message: payload.message, timestamp: payload.timestamp, photoURL: "", displayName: payload.name, myMessage: (user_uuid == payload.user.uuid), key: messages.length + 1 };
    // let oldMessages = JSON.parse(JSON.stringify(messages));
    // console.log(oldMessages);
    // oldMessages.push(newMessage);
    // console.log(oldMessages);
    // setMessages(oldMessages);
    setMessages(messages => messages.concat([{ message: payload.message, timestamp: payload.timestamp, photoURL: "", displayName: payload.user.name, myMessage: (user_uuid == payload.user.uuid), key: messages.length + 1 }]));
    // console.log(messages);
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  }

  useEffect(() => {
    const channel = `messages.${store_uuid}.${branch_uuid}.default`;
    window.Echo.channel(channel)
      .subscribed(() => {
        console.log('Now listening to events from channel: ' + channel);
      })
      .listen('MessagePublished', (data) => {
        console.log("WS got: " + JSON.stringify(data));
        handleReceiveNewMessage(data);
      }
      );

  }, []);

  return (
    // <div className={classes.container}>
    <Paper className={classes.paper} zdepth={2}>
      <Paper id="style-1" className={classes.messagesBody}>
        {messages.map((message) => (
          <ChatBubble key={message.key} data={message}></ChatBubble>
        ))}
        <div ref={scrollRef} />
      </Paper>
      <ChatInput handleSend={handleSendMessage} />
    </Paper>
    // </div>
  );
}
