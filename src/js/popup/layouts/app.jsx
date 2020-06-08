import React from "react";
import { Provider, observer } from 'mobx-react'

import Loading from "popup/components/loading"

import SignIn from "popup/components/auth/sign_in";
import Content from "popup/components/content";

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
				<Loading/>
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