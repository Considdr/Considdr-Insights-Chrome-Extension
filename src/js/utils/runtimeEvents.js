import * as runtimeEventsTypes from '../constants/runtimeEventsTypes.js'

export function highlight () {
	window.chrome.runtime.sendMessage({
		type: runtimeEventsTypes.HIGHLIGHT
	})
}

export function setBadgeCount (numInsights) {
	window.chrome.runtime.sendMessage({
		type: runtimeEventsTypes.SET_BADGE_COUNT,
		data: {
			numInsights: numInsights
		}
	})
}