import React from "react";

import SignIn from "components/auth/sign_in";

class App extends React.Component {
	componentDidMount = () => {
		console.log("HELLO")

		window.chrome.runtime.sendMessage({ type: '123' })

		console.log("AFTER");
	}

	render () {
	    return (
	      <SignIn />
	    )
	  }
}

export default App