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

const chromeRegex = new RegExp("chrome.*:\/\/")

function manualHighlight () {
    window.chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const activeTab = tabs[0]

        if (!activeTab) {
            return
        }

        if (chromeRegex.test(activeTab.url)) {
            runtimeEvents.updateInsights()
            return
        }

        highlight(activeTab.id, activeTab.url)
    })
}

function autoHighlight(tabID, tabURL) {
    endpoint
        .url("/auth/sessions")
        .get()
        .res(() => {
            highlight(tabID, tabURL)
        })
        .catch(() => {})
}

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
			highlightsRepository.persist(tabURL, [], function() {
				updateBadge(tabURL)
                runtimeEvents.updateInsights()
			})
		})
}

function processResponse(tabID, tabURL, response) {
	if (!response["data"] || !response["data"]["insights"]) {
		highlightsRepository.persist(tabURL, [], function() {
			updateBadge(tabURL)
            runtimeEvents.updateInsights()
		})
		return
	}

	let insights = response["data"]["insights"].map(item => item.name);

	executeHighlight(tabID, tabURL, insights);
}

function highlight(tabID, tabURL) {
    highlightsRepository.getInsights(tabURL, function(insights) {
		if (insights == undefined) {
			getInsights(tabID, tabURL)
		} else if (insights.length == 0) {
			updateBadge(tabURL)
            runtimeEvents.updateInsights()
		} else {
			executeHighlight(tabID, tabURL, insights)
		}
	})
}

function executeHighlight(tabID, tabURL, insights) {
    chrome.tabs.executeScript(tabID, {
        code: `var insights = ${JSON.stringify(insights)}; var tabURL = "${tabURL}"`
    }, function() {
        chrome.tabs.executeScript(tabID, {
            file: 'highlight.bundle.js'
        }, ()=>void chrome.runtime.lastError
        );
    });
}

function setBadge (numInsights) {
    clearBadge()

    if (numInsights === null) {
        return
    }

    window.chrome.browserAction.setBadgeBackgroundColor({
        color: badgeColor
    })
    
    window.chrome.browserAction.setBadgeText({
        text: numInsights.toString()
    })
}

function clearBadge () {
    window.chrome.browserAction.setBadgeText({ text: '' })
}

function updateBadge(tabURL) {
    highlightsRepository.getInsightCount(tabURL, function(numInsights) {
        if (numInsights === null) {
            clearBadge()
        } else {
            setBadge(numInsights)
        }
    })
}

window.chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.type) {
        case runtimeEventsTypes.HIGHLIGHT:
            manualHighlight()
            
            break
        case runtimeEventsTypes.HIGHLIGHTED_PAGE:
            const requestData = request.data

            if (!requestData) {
                return
            }

            updateBadge(requestData.tabURL)
            runtimeEvents.updateInsights()

            break
        case runtimeEventsTypes.SIGN_OUT:
            highlightsRepository.clear()
            autoHighlightRepository.clear()

            break
    }
})

window.chrome.tabs.onActivated.addListener(function(activeInfo) {
    window.chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const activeTab = tabs[0]

        if (!activeTab) {
            return
        }

        updateBadge(activeTab.url)
    })
});

window.chrome.tabs.onUpdated.addListener(function(tabID, changeInfo) {
    if (!(changeInfo.url)) {
        return
    }

    updateBadge(changeInfo.url)

    if (chromeRegex.test(changeInfo.url)) {
        return
    }

    autoHighlightRepository.get(function(status) {
        if (status) {
            autoHighlight(tabID, changeInfo.url)
        }
    })
})

window.chrome.windows.onFocusChanged.addListener(function() {
    window.chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const activeTab = tabs[0]

        if (!activeTab) {
            return
        }

        updateBadge(activeTab.url)
    })
})

window.chrome.runtime.onStartup.addListener(function() {
    highlightsRepository.clearUnaccessed()
})