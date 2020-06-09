import React from "react"
import { render } from "react-dom"

import wretch from "wretch"
import secrets from "secrets"

import { App } from "popup/layouts"
import { Auth } from "popup/stores"

import 'semantic-ui-css/semantic.min.css'
import 'styles/layouts/app.sass'

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
