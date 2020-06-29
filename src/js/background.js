import 'images/icon-16.png'
import 'images/icon-34.png'
import 'images/icon-48.png'
import 'images/icon-128.png'

import wretch from "wretch"
import secrets from "secrets"

import * as runtimeEventsTypes from 'js/constants/runtimeEventsTypes'
import * as runtimeEvents from 'js/utils/runtimeEvents'

import * as highlightsRepository from 'js/repositories/highlights'
import * as autoHighlightRepository from 'js/repositories/autoHighlight'

const endpoint = wretch()
  .url(secrets.apiEndpoint)

const badgeColor = "#2d84de"

// Regex to match all Chrome internal URLs
const chromeRegex = new RegExp("chrome.*:\/\/")

/**
 * Manually highlights the page's insights. This function is triggered when the
 * user clicks the "Find Insights" button
 */
function manualHighlight () {
    window.chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const activeTab = tabs[0]

        if (!activeTab) return

        // The content script can't be executed on a Chrome internal URL
        if (chromeRegex.test(activeTab.url)) {
            runtimeEvents.updateInsights()
            return
        }

        highlight(activeTab.id, activeTab.url)
    })
}

/**
 * Automatically highlights the page's insights. This function is triggered
 * automatically if the user has enabled automatic insight highlighting
 * 
 * @param {Number} tabID The id of the tab to be highlighted
 * @param {String} tabURL The URL of the tab to be highlighted
 */
function autoHighlight(tabID, tabURL) {
    // Confirm that the user has been authenticated before highlighting insights
    endpoint
        .url("/auth/sessions")
        .get()
        .res(() => {
            highlight(tabID, tabURL)
        })
        .catch(() => {})
}

/**
 * Highlights the page's insights.
 * 
 * @param {Number} tabID The id of the tab to be highlighted
 * @param {String} tabURL The URL of the tab to be highlighted
 */
function highlight(tabID, tabURL) {
    /*
        Checks the insights repository to see if the insights are available in
        chrome storage
    */
    highlightsRepository.getInsights(tabURL, function(insights) {
		if (insights == undefined) {
            /*
                If the insights are not in chrome storage, make a request for
                the insights from the API
            */
			getInsights(tabID, tabURL)
		} else if (insights.length == 0) {
            // If this page has no insights, set the badge to 0
			updateBadge(tabURL)
            runtimeEvents.updateInsights()
		} else {
            /*
                If the page's insights are in chrome storage, highlight them on
                the page
            */
			executeHighlight(tabID, tabURL, insights)
		}
	})
}

/**
 * Makes a call to the API to request insights for the given URL
 * 
 * @param {Number} tabID The id of the tab for which to request insights
 * @param {String} tabURL The URL of the tab for which to request insights
 */
function getInsights(tabID, tabURL) {
	endpoint
		.url("/get_work_insights")
		.query({
			work_url: tabURL
		})
		.get()
		.json(json => {
			processResponse(tabID, tabURL, json)
		})
		.catch(() => {
            /*
                If there was an error getting insights from the API, set the
                URL's valid insights to an empty array
            */
			highlightsRepository.persist(tabURL, [], function() {
				updateBadge(tabURL)
                runtimeEvents.updateInsights()
			})
		})
}

/**
 * Processes the API response to a request for insight for the given URL
 * 
 * @param {Number} tabID The id of the tab of which insights were requested
 * @param {String} tabURL The URL of the tab of which insights were requested
 * @param {JSON} response The API response
 */
function processResponse(tabID, tabURL, response) {
	if (!response["data"] || !response["data"]["insights"]) {
        /*
            If there was an error getting insights from the API, set the
            URL's valid insights to an empty array
        */
		highlightsRepository.persist(tabURL, [], function() {
			updateBadge(tabURL)
            runtimeEvents.updateInsights()
        })
        
		return
	}

	const insights = response["data"]["insights"].map(item => item.name)

	executeHighlight(tabID, tabURL, insights);
}

/**
 * Triggers the content script to highlight the page's insights
 * 
 * @param {Number} tabID The id of the tab to be highlighted
 * @param {String} tabURL The URL of the tab to be highlighted
 * @param {Array} insights The page's insights to be highlighted
 */
function executeHighlight(tabID, tabURL, insights) {
    chrome.tabs.executeScript(tabID, {
        // Set the insights and tab URL variables for the content script
        code: `const insights = ${JSON.stringify(insights)}; const tabURL = "${tabURL}"`
    }, function() {
            // Trigger the content script on the provided tab
            chrome.tabs.executeScript(tabID, {
                file: 'highlight.bundle.js'
            }, () => void chrome.runtime.lastError
        );
    });
}

/**
 * Updates the extension badge for the given tab to display the number of
 * insights on the current tab
 * 
 * @param {String} tabURL The URL of the tab to be updated
 */
function updateBadge(tabURL) {
    highlightsRepository.getInsightCount(tabURL, function(numInsights) {
        if (numInsights === null) {
            clearBadge()
        } else {
            setBadge(numInsights)
        }
    })
}

/**
 * Sets the number of valid insights on the badge
 * 
 * @param {Number} numInsights 
 */
function setBadge (numInsights) {
    clearBadge()

    if (numInsights === null) return

    window.chrome.browserAction.setBadgeBackgroundColor({
        color: badgeColor
    })
    
    window.chrome.browserAction.setBadgeText({
        text: numInsights.toString()
    })
}

/**
 * Clears the badge text
 */
function clearBadge () {
    window.chrome.browserAction.setBadgeText({ text: '' })
}

/**
 * Listens to runtime messages being sent by the popup and content scripts
 */
window.chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.type) {
        case runtimeEventsTypes.HIGHLIGHT:
            /*
                Message sent by popup when a user clicks the "Find Insights"
                button.

                Trigger the manual highlight function to highlight the page's
                insights
            */
            manualHighlight()
            
            break
        case runtimeEventsTypes.HIGHLIGHTED_PAGE:
            /*
                Message sent by insight highlight content script on completion.

                Update the badge text, and inform the popup
            */
            const requestData = request.data

            if (!requestData) return

            updateBadge(requestData.tabURL)
            runtimeEvents.updateInsights()

            break
        case runtimeEventsTypes.SIGN_OUT:
            /*
                Message sent by popup on sign out.

                Clear the insight and auto highlight repositories
            */
            highlightsRepository.clear()
            autoHighlightRepository.clear()

            break
    }
})

/**
 * Updates the badge text (i.e. number of valid insights) on an active tab 
 * change
 */
window.chrome.tabs.onActivated.addListener(function(activeInfo) {
    window.chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const activeTab = tabs[0]

        if (!activeTab) return

        updateBadge(activeTab.url)
    })
});

/**
 * Updates the badge text (i.e. number of valid insights) on a tab url change,
 * and will trigger the insight highlight content script if the user has enabled
 * auto highlighting
 */
window.chrome.tabs.onUpdated.addListener(function(tabID, changeInfo) {
    if (!(changeInfo.url)) return

    updateBadge(changeInfo.url)

    // The content script can't be executed on a Chrome internal URL
    if (chromeRegex.test(changeInfo.url)) return

    autoHighlightRepository.get(function(status) {
        if (status) autoHighlight(tabID, changeInfo.url)
    })
})

/**
 * Updates the badge text (i.e. number of valid insights) on a window focus
 * change (i.e. on a user switching between windows)
 */
window.chrome.windows.onFocusChanged.addListener(function() {
    window.chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const activeTab = tabs[0]

        if (!activeTab) return

        updateBadge(activeTab.url)
    })
})

/**
 * Trigger the insights repository clearing on start up
 */
window.chrome.runtime.onStartup.addListener(function() {
    highlightsRepository.clearUnaccessed()
})