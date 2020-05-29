import React from "react";
import { observer } from 'mobx-react'

import SignIn from "./auth/sign_in";
import Content from "./content";

@observer
class App extends React.Component {
	constructor(props) {
		super(props)
	}

	render () {
    const { auth } = this.props
		const signedIn = auth.signedIn

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