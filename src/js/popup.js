import App from "js/popup/layouts/app"
import React from "react"
import { render } from "react-dom"

import wretch from "wretch";
import secrets from "secrets";

import 'semantic-ui-css/semantic.min.css'

import { Auth } from "./popup/stores"

const endpoint = wretch()
  .url(secrets.apiEndpoint)
  .accept("application/json")

const resources = {
  endpoint,
  auth: new Auth(endpoint)
}

render(
  <App {...resources}/>,
  window.document.getElementById("popup")
);
