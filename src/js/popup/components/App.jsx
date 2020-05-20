import React from "react";

import SignIn from "./auth/sign_in";
import Content from "./content";

class App extends React.Component {
	render () {
		const signedIn = false;
		let content
		if (signedIn) {
			content = <Content />
		} else {
			content = <SignIn />
		}

		return(
			<div>
				{content}
			</div>
		)
	  }
}

export default App