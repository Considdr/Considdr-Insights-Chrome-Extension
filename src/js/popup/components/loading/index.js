import React from 'react'

import { Image } from 'semantic-ui-react'

import spinner from './tail-spin.svg';

import "styles/components/loading/index.sass"

const Loading = (props) =>
  <div>
    <img src={spinner} />
    <div styleName="spinnerLabel">
      {props.label}
    </div>
  </div>
  

export default Loading;