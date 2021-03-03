import moment from 'moment';
import React from 'react';

export default function TimeRenderer(props) {
  const now = moment();

  const { value } = props;
  let retval;
  if (value) {
    const timeStamp = moment(value);
    const fromNow = timeStamp.from(now);
    retval = (
      <span>
        {timeStamp.format('ddd, DD.MMM YY HH:mm')} ({fromNow})
      </span>
    );
  } else {
    retval = '';
  }

  return retval;
}
