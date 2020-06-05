import 'images/icon-128.png'
import 'images/icon-34.png'

import * as highlightsRepository from 'js/repositories/highlights'
import * as runtimeEventsTypes from 'js/constants/runtimeEventsTypes'

function highlight () {
    window.chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0]

        if (!activeTab || activeTab.url.includes("chrome://")) {
            return
        }

        var activeTabId = activeTab.id

        chrome.tabs.executeScript(activeTabId, {
            code: `var tabId = ${activeTabId}`
        }, function() {
            chrome.tabs.executeScript(activeTabId, {file: 'highlight.bundle.js'});
        });
    })
}

function setBadge (numInsights) {
    if (numInsights === undefined) {
        return
    }

    clearBadge()

    var color = "#2d84de"

    window.chrome.browserAction.setBadgeBackgroundColor({
        color: color
    })
    
    window.chrome.browserAction.setBadgeText({
        text: numInsights.toString()
    })
}

function storeInsightCount(requestData) {
    if (!requestData) {
        return
    }

    var tabId = requestData.tabId
    var numInsights = requestData.numInsights

    if (tabId === undefined || numInsights === undefined) {
        return
    }

    highlightsRepository.persist(tabId, numInsights)
}

function clearBadge () {
    window.chrome.browserAction.setBadgeText({ text: '' })
}

function highlightedPage(requestData) {
    storeInsightCount(requestData)
    setBadge(requestData.numInsights)
}

function updateBadge(tabId) {
    var numInsights = highlightsRepository.get(tabId)

    if (!numInsights) {
        clearBadge()
    }

    setBadge(numInsights)
}

window.chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === runtimeEventsTypes.HIGHLIGHT) {
        highlight()
    }

    if (request.type === runtimeEventsTypes.HIGHLIGHTED_PAGE) {
        var requestData = request.data

        if (!requestData) {
            return
        }

        highlightedPage(requestData)
    }
})

window.chrome.tabs.onActivated.addListener(function(activeInfo) {
    updateBadge(activeInfo.tabId)
});

window.chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    highlightsRepository.remove(tabId)
})

window.chrome.windows.onFocusChanged.addListener(function() {
    window.chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0]

        if (!activeTab) {
            return
        }

        var activeTabId = tabs[0].id

        updateBadge(activeTabId)
    })
})