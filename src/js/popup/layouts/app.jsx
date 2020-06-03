import React from "react";
import { Provider, observer } from 'mobx-react'

import SignIn from "../components/auth/sign_in";
import Content from "../components/content";

@observer
export default class App extends React.Component {
	constructor(props) {
		super(props)
	}

	componentDidMount() {
		const { auth } = this.props
		auth.validate()
	}

	render () {
		const { auth } = this.props
		const { signedIn, isLoading } = auth

		if (isLoading) {
			return (
				<div> Loading now now... </div>
			)
		}

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