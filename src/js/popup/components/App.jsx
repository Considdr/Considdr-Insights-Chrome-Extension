import React from "react";

import SignIn from "./auth/sign_in";
import Content from "./content";

class App extends React.Component {
	render () {
		const { auth } = this.props

		const signedIn = false;
		let content
		if (signedIn) {
			content = <Content {...this.props}/>
		} else {
			content = <SignIn {...this.props}/>
		}

		return(
			<div>
				{content}
			</div>
		)
	  }
}

export default App