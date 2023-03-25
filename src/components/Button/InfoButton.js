import React from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';

function InfoButton(props) {
    const {
        title
    } = props;


  return (
    <Tooltip 
        title={title}
    >
      <IconButton aria-label="info" size = 'small'>
        <InfoIcon  size = 'small' />
      </IconButton>
    </Tooltip>
  );
}

export default InfoButton;