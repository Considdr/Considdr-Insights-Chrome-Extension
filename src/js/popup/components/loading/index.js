import React from 'react'

import spinner from './tail-spin.svg';
import styles from "styles/components/loading/spinner"

const Loading = () =>
  <div className={ styles.spinner }>
    <img src={spinner} />
  </div>;

export default Loading;