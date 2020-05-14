import SignIn from "components/auth/sign_in";
import React from "react";
import { render } from "react-dom";

import 'semantic-ui-css/semantic.min.css'

render(
  <SignIn/>,
  window.document.getElementById("popup")
);
