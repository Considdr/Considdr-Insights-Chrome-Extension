import React from "react";

import { Provider, observer } from 'mobx-react'

import SignIn from "popup/components/auth/sign_in";
import Content from "popup/components/content";
import Loading from "popup/components/loading"

import 'styles/layouts/app.sass'

@observer
export default class App extends React.Component {
	constructor(props) {
		super(props)
	}

	componentDidMount() {
		const { auth } = this.props
		auth.validate()
	}

	renderApp() {
		const { auth } = this.props
		const { signedIn, isLoading } = auth
		
		if (isLoading) return <Loading/>

		if (signedIn) {
			return <Content/>
		} else {
			return <SignIn/>
		}
	}

	render () {
		return(
			<Provider {...this.props}>
				<div id="Application" styleName='app'>
					{ this.renderApp() }
				</div>
			</Provider>
		)
	}
}