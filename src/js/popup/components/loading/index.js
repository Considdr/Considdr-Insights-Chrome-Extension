import React from 'react'

import { Image } from 'semantic-ui-react'

import spinner from './tail-spin.svg';

import "styles/components/loading/index.sass"

/**
 * The default loading component (with a loading animation) that will also
 * display a provided loading message 
 * 
 * @param {*} props 
 */
const Loading = (props) =>
  <div>
    <img src={spinner} />
    <div styleName="spinnerLabel">
      {props.label}
    </div>
  </div>
  

export default Loading;