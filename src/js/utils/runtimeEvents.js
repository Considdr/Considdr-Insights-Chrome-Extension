import * as runtimeEventsTypes from '../constants/runtimeEventsTypes.js'

export function highlight () {
	window.chrome.runtime.sendMessage({
		type: runtimeEventsTypes.HIGHLIGHT
	})
}

export function highlightedPage (tabId, numInsights) {
	window.chrome.runtime.sendMessage({
		type: runtimeEventsTypes.HIGHLIGHTED_PAGE,
		data: {
			tabId: tabId,
			numInsights: numInsights
		}
	})
}