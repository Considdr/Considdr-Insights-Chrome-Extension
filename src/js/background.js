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

function highlight(tabID, tabURL) {
    chrome.tabs.executeScript(tabID, {
        code: `var tabURL = "${tabURL}"`
    }, function() {
        chrome.tabs.executeScript(tabID, {
            file: 'highlight.bundle.js'
        }, ()=>void chrome.runtime.lastError
        );
    });
}

function setBadge (numInsights) {
    if (numInsights === null) {
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

function clearBadge () {
    window.chrome.browserAction.setBadgeText({ text: '' })
}

function updateBadge(tabURL) {
    if (chromeRegex.test(tabURL)) {
        clearBadge()
        return
    }

    highlightsRepository.getInsightCount(tabURL, function(numInsights) {
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

            updateBadge(requestData.tabURL)

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
    highlightsRepository.sift()
})