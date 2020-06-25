/*
	Runtime events helper that is responsible for the passing of messages
	between the background script and the popup
*/

import * as runtimeEventsTypes from '../constants/runtimeEventsTypes.js'

export function highlight () {
	window.chrome.runtime.sendMessage({
		type: runtimeEventsTypes.HIGHLIGHT
	})
}

export function highlightedPage (tabURL) {
	window.chrome.runtime.sendMessage({
		type: runtimeEventsTypes.HIGHLIGHTED_PAGE,
		data: {
			tabURL: tabURL
		}
	})
}

export function updateInsights() {
	window.chrome.runtime.sendMessage({
		type: runtimeEventsTypes.UPDATE_INSIGHTS
	})
}

export function signOut () {
	window.chrome.runtime.sendMessage({
		type: runtimeEventsTypes.SIGN_OUT
	})
}