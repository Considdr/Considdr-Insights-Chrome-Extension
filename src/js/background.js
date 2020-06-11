import 'images/icon-16.png'
import 'images/icon-34.png'
import 'images/icon-48.png'
import 'images/icon-128.png'

import wretch from "wretch"
import secrets from "secrets"

import * as runtimeEventsTypes from 'js/constants/runtimeEventsTypes'

import * as highlightsRepository from 'js/repositories/highlights'
import * as autoHighlightRepository from 'js/repositories/autoHighlight'

const endpoint = wretch()
  .url(secrets.apiEndpoint)

const badgeColor = "#2d84de"

const chromeRegex = new RegExp("chrome.*:\/\/")

function manualHighlight () {
    window.chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const activeTab = tabs[0]

        if (!activeTab || chromeRegex.test(activeTab.url)) {
            return
        }

        executeHighlight(activeTab.id)
    })
}

function autoHighlight(tabId) {
    highlightsRepository.get(tabId, function(numInsights) {
        if (!numInsights) {
            executeHighlight(tabId)
        } else {
            setBadge(numInsights)
        }
    }) 
}

function executeHighlight(activeTabId) {
    chrome.tabs.executeScript(activeTabId, {
        code: `var tabId = ${activeTabId}`
    }, function() {
        chrome.tabs.executeScript(activeTabId, {
            file: 'highlight.bundle.js'
        }, ()=>void chrome.runtime.lastError
        );
    });
}

function setBadge (numInsights) {
    if (numInsights === undefined) {
        return
    }

    clearBadge()

    window.chrome.browserAction.setBadgeBackgroundColor({
        color: badgeColor
    })
    
    window.chrome.browserAction.setBadgeText({
        text: numInsights.toString()
    })
}

function storeInsightCount(requestData) {
    if (!requestData) {
        return
    }

    const tabId = requestData.tabId
    const numInsights = requestData.numInsights

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
    highlightsRepository.get(tabId, function(numInsights) {
        if (!numInsights) {
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

            highlightedPage(requestData)

            break
    }
})

window.chrome.tabs.onActivated.addListener(function(activeInfo) {
    updateBadge(activeInfo.tabId)
});

window.chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    highlightsRepository.remove(tabId)
})

window.chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
    if (!('url' in changeInfo)) {
        return
    }

    highlightsRepository.remove(tabId)
    clearBadge()

    if (chromeRegex.test(changeInfo['url'])) {
        return
    }

    autoHighlightRepository.get(function(status) {
        if (status) {
            autoHighlight(tabId)
        }
    })
})

window.chrome.windows.onFocusChanged.addListener(function() {
    window.chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const activeTab = tabs[0]

        if (!activeTab) {
            return
        }

        updateBadge(activeTab.id)
    })
})