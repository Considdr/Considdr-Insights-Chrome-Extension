import App from "js/popup/components/App"
import React from "react"
import { render } from "react-dom"

import 'semantic-ui-css/semantic.min.css'

import { Auth } from "./popup/utils"

const resources = {
	auth: new Auth()
}

render(
  <App {...resources}/>,
  window.document.getElementById("popup")
);
