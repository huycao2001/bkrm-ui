// import React from 'react'
import PropTypes from 'prop-types';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

import React, { useRef, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { infoActions } from '../../../../store/slice/infoSlice';

function CashierTableView(props) {

    const{
      tables,
      selectedTable,
      setSelectedTable
    } = props;

    const info = useSelector((state) => state.info);
    const store_uuid = info.store.uuid;
    const branch = info.branch;
    const branch_uuid = info.branch.uuid;






    
  return (




    <div>
      {tables.map((row, index) => {
            return (
              <div
                key = {index}
                onClick = {() => setSelectedTable(row)}

              >
                {row.name}

                {selectedTable?.uuid === row.uuid && "   -- chosen"}
              </div>
            );
          })}

    </div>
  )
}




CashierTableView.propTypes = {}

export default CashierTableView;
