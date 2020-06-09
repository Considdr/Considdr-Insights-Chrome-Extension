import React from "react";

import { inject } from 'mobx-react'

import Layout from "js/popup/layouts/layout"
import Highlight from "./highlight"
import Insights from "./insights"

import { List, Image, Button } from 'semantic-ui-react'

import Loading from "popup/components/loading"

import banner from "images/banner.png"
import logo from "images/icon-128.png"

import * as highlightsRepository from 'js/repositories/highlights'

@inject('auth')
export default class Content extends React.Component {
	constructor(props) {
		super(props)

		this.state = { isLoading: true, numInsights: undefined }
	}

	componentDidMount() {
		window.chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
			const activeTab = tabs[0]
			if (activeTab) {
				this.updateNumInsights(highlightsRepository.get(activeTab.id))
			}
		})
	}

	goToConsiddr = (e) => {
		e.preventDefault();

		chrome.tabs.update({
			url: "https://www.considdr.com/"
	   });
	}

	signOut = (e) => {
		e.preventDefault();
		
		const { auth } = this.props;
		auth.signOut();
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
				<Image src={banner}/>
				{ this.renderHighlightState() }

				<List bulleted horizontal>
					<List.Item as='a' onClick={this.goToConsiddr}>Considdr.com</List.Item>
					<List.Item as='a' onClick={this.signOut}>Sign Out</List.Item>
				</List>
			</Layout>
		)
	}
}
