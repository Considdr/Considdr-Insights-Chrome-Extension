import React from "react"
import { render } from "react-dom"

import wretch from "wretch"
import secrets from "secrets"

import { App } from "popup/layouts"
import { Auth } from "popup/stores"

import 'semantic-ui-css/semantic.min.css'
import 'styles/layouts/app.sass'

// Init API endpoint
const endpoint = wretch()
  .url(secrets.apiEndpoint)
  .accept("application/json")

// Init App resources
const resources = {
  endpoint,
  auth: new Auth(endpoint)
}

render(
  <App {...resources}/>,
  window.document.getElementById("popup")
);
