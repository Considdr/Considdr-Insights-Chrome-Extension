import React from "react";

import { inject } from 'mobx-react'

import Layout from "js/popup/layouts/layout"

import { Button } from 'semantic-ui-react'

@inject('auth')
export default class Content extends React.Component {
	signOut = (e) => {
		e.preventDefault();

		const { auth } = this.props;

		auth.signOut();
	}

	render() {
		const { auth } = this.props

		return (
			<Layout>
				<h1> CONTENT </h1>
				<Button onClick={this.signOut}> Sign Out</Button>
			</Layout>
		)
	}
}
