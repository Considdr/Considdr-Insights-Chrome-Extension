import React from "react";

import { inject } from 'mobx-react'

import Layout from "js/popup/layouts/layout"

import { Button } from 'semantic-ui-react'

import * as runtimeEvents from 'js/utils/runtimeEvents'

@inject('auth')
export default class Content extends React.Component {
	signOut = (e) => {
		e.preventDefault();
		
		const { auth } = this.props;
		auth.signOut();
	}

	highlight = () => {
		runtimeEvents.highlight()
	}

	render() {
		return (
			<Layout>
				<h1> CONTENT </h1>
				<Button onClick={this.highlight}> Highlight</Button>
				<hr/>
				<Button onClick={this.signOut}> Sign Out</Button>
			</Layout>
		)
	}
}
