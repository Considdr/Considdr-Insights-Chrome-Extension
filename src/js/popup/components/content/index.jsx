import React from "react";

import { inject } from 'mobx-react'

import Layout from "js/popup/layouts/layout"
import Highlight from "./highlight"
import Insights from "./insights"

import { Image, Button } from 'semantic-ui-react'

import Loading from "popup/components/loading"

import logo from "images/logo.png"

import * as highlightsRepository from 'js/repositories/highlights'

@inject('auth')
export default class Content extends React.Component {
	constructor(props) {
		super(props)

		this.state = { isLoading: true, numInsights: undefined }
	}

	signOut = (e) => {
		e.preventDefault();
		
		const { auth } = this.props;
		auth.signOut();
	}

	componentDidMount() {
		window.chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
			const activeTab = tabs[0]
			if (activeTab) {
				this.updateNumInsights(highlightsRepository.get(activeTab.id))
			}
		})
	}

	updateNumInsights = (numInsights) => {
		this.setState({
			isLoading: false,
			numInsights: numInsights
		});
	}

	renderHighlightState() {
		const { isLoading, numInsights } = this.state
		
		if (isLoading) return <Loading/>

		if (numInsights !== undefined) {
			return <Insights numInsights={numInsights}/>
		}

		return <Highlight/>
	}

	render() {
		return (
			<Layout>
				<Image src={logo}/>
				{ this.renderHighlightState() }
				<Button onClick={this.signOut}> Sign Out</Button>
			</Layout>
		)
	}
}
