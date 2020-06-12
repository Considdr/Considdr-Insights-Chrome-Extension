import React from "react";

import { inject, observer } from 'mobx-react'
import { extendObservable } from "mobx";

import { Insights } from 'popup/stores'

import Layout from "popup/layouts/layout"
import InsightsDisplay from "./insightsDisplay"
import AutoHighlight from "./autoHighlight"

import { Grid } from 'semantic-ui-react'

import Loading from "popup/components/loading"

import * as runtimeEventsTypes from 'js/constants/runtimeEventsTypes'

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
			if (request.type == runtimeEventsTypes.UPDATE_INSIGHTS) {
				this.insights.init()
			}
		})
	}

	highlight = () => {
		this.insights.highlight()
	}

	renderHighlightState() {
		const { isLoading, numInsights } = this.insights
		
		if (isLoading) return <Loading label={"Looking for insights..."}/>

		return <InsightsDisplay numInsights={numInsights} highlight={this.highlight}/>
	}

	render() {
		return (
			<Layout>
				<Grid centered padded="vertically">
					<Grid.Row>
						{ this.renderHighlightState() }
					</Grid.Row>

					<Grid.Row>
						<AutoHighlight/>
					</Grid.Row>
				</Grid>
			</Layout>
		)
	}
}
