import React from "react";

import SignIn from "./auth/sign_in";
import Content from "./content";

class App extends React.Component {
	render () {
		const signedIn = true;

		if (signedIn) {
			return (
			  <Content />
			)
		}

	    return (
	      <SignIn />
	    )
	  }
}

export default App