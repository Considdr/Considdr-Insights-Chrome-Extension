import React from "react";

import { inject, observer } from 'mobx-react'
import { extendObservable } from "mobx";

import Layout from "js/popup/layouts/layout"
import Highlight from "./highlight"
import InsightCount from "./insightCount"
import AutoHighlight from "./autoHighlight"

import { List, Grid, Image } from 'semantic-ui-react'

import Loading from "popup/components/loading"

import logo from "images/icon-128.png"

import "styles/components/content/index.sass"

import * as runtimeEventsTypes from 'js/constants/runtimeEventsTypes'

import { Insights } from 'popup/stores'

@inject('auth') @observer
export default class Content extends React.Component {
	constructor(props) {
		super(props)

		extendObservable(this, {
			insights: new Insights
		})
	}

	componentDidMount() {
		window.chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
			if (request.type == runtimeEventsTypes.HIGHLIGHTED_PAGE) {
				const requestData = request.data
				if (!requestData) {
					return
				}

				this.insights.init()
			}
		})
	}

	goToConsiddr = (e) => {
		e.preventDefault();

		window.chrome.tabs.update({
			url: "https://www.considdr.com/"
	   });
	}

	signOut = (e) => {
		e.preventDefault();
		
		const { auth } = this.props;
		auth.signOut();
	}

	renderHighlightState() {
		const { isLoading, numInsights } = this.insights
		
		if (isLoading) return <Loading label={"Looking for insights..."}/>

		if (numInsights === null) return <Highlight highlight={this.highlight}/>

		return <InsightCount numInsights={numInsights}/>
	}

	highlight = (e) => {
		e.preventDefault();
		this.insights.highlight()
	}

	render() {
		return (
			<Layout>
				<Grid centered padded="vertically">
					<Grid.Row>
						<div>
							{ this.renderHighlightState() }
						</div>
					</Grid.Row>

					<Grid.Row>
						<AutoHighlight/>
					</Grid.Row>
				</Grid>

				<List bulleted horizontal styleName="footer">
					<List.Item as='a' onClick={this.goToConsiddr}>
						<Image avatar src={logo} />
					</List.Item>
					<List.Item as='a' onClick={this.signOut}>Sign Out</List.Item>
				</List>
			</Layout>
		)
	}
}
