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

export function signOut () {
	window.chrome.runtime.sendMessage({
		type: runtimeEventsTypes.SIGN_OUT
	})
}