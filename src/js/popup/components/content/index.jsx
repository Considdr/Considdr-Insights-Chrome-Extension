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

	highlight = () => {
		// window.chrome.tabs.executeScript(null, {file: "content_scripts/highlight.js"});
	}

	render() {
		const { auth } = this.props

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
