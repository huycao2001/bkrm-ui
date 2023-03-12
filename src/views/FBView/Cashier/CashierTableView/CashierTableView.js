// import React from 'react'
import PropTypes from 'prop-types';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

import React, { useRef, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { infoActions } from '../../../../store/slice/infoSlice';

function CashierTableView(props) {


    const info = useSelector((state) => state.info);
    const store_uuid = info.store.uuid;
    const branch = info.branch;
    const branch_uuid = info.branch.uuid;



    useEffect(() => {
        try {
          //const channel = pusher.subscribed('bkrm_ws.' + store_uuid + '.' + branch_uuid + '.fb_orders');
          window.Echo = new Echo({
            broadcaster: 'pusher',
            key: 'apollo13',
            //host: 'http://localhost:6001', // set the host and port
            wsHost: window.location.hostname,
            wsPort: 6001,
            wssPort: 6001,
            forceTLS: false,
            //disableStats: true,
            encrypted: true,
            enabledTransports: ['ws', 'wss'],
            cluster: 'ap1',
            authEndpoint: 'http://localhost:8000/broadcasting/auth'
          });


          var channel = 'bkrm_ws.' + store_uuid + '.' + branch_uuid + '.fb_orders';
          window.Echo.channel(channel)
          .subscribed(() => {
            console.log('Now listening to events from channel: ' + channel);
          })
          .listen('order.event', (data) => {
            console.log("WS got: " + JSON.stringify(data));
            //handleReceiveNewMessage(data);
          }
          );
          // ws.channel('bkrm_ws.' + store_uuid + '.' + branch_uuid + '.fb_orders').subscribed(() => {
          //  console.log('You are subscribed');
          // }).listen('OrderEvent' , (data) => {
          //   console.log("cao ba huy " + data)
          // })
          
          // ;

          //const channel = ws.private('bkrm_ws.' + store_uuid + '.' + branch_uuid + '.fb_orders');


          //const Pusher = require("pusher");

          // const pusher = new Pusher({
          //   appId: "bkrm", // Replace with 'app_id' from dashboard
          //   key: "apollo13", // Replace with 'key' from dashboard
          //   secret: "9632da953281f8a2a6ca", // Replace with 'secret' from dashboard
          //   cluster: "ap1", // Replace with 'cluster' from dashboard
          //   useTLS: true,
          // });

          //const options = {};

          //const res = pusher.trigger('bkrm_ws.' + store_uuid + '.' + branch_uuid + '.fb_orders', "my-event", { message: "hello world" } , null);

          // Send a whisper event to the private channel
          //const recipientId = 1;
          //const eventName = 'pusher:hello';
          //const eventData = { message: 'Hello from JavaScript!' };

          //Closing

          //const res = channel.whisper(eventName, eventData);
          //console.log("Whisper result " + JSON.stringify(res, censor(res))  ) 


        } catch (e) {
          console.log('error for socket ' + e);
        }
      }, []);


    
  return (
    <div>CashierTableView</div>
  )
}




CashierTableView.propTypes = {}

export default CashierTableView;
