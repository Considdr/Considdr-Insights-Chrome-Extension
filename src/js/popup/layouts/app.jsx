import React from "react";
import { Provider, observer } from 'mobx-react'

import SignIn from "../components/auth/sign_in";
import Content from "../components/content";

@observer
export default class App extends React.Component {
	constructor(props) {
		super(props)
	}

	render () {
    	const { auth } = this.props
		const signedIn = auth.signedIn

		let content
		if (signedIn) {
			content = <Content/>
		} else {
			content = <SignIn/>
		}

		return(
			<Provider {...this.props}>
				{content}
			</Provider>
		)
	}
}