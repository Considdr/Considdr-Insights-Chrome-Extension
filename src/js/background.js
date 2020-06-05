import 'images/icon-128.png'
import 'images/icon-34.png'

import * as runtimeEventsTypes from 'js/constants/runtimeEventsTypes'

function highlight () {
    window.chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

        console.log(tabs[0].id)

        var activeTabId = tabs[0].id;
        window.chrome.tabs.executeScript(activeTabId, {
            file: "highlight.bundle.js"
        });
    })
}

function setBadgeCount (numInsights) {
    clearBadge()

    let color = "#2d84de"

    window.chrome.browserAction.setBadgeBackgroundColor({
        color: color
    })
    
    window.chrome.browserAction.setBadgeText({
        text: numInsights.toString()
    })
}

function clearBadge () {
    window.chrome.browserAction.setBadgeText({ text: '' })
}

window.chrome.runtime.onMessage.addListener(request => {
    if (request.type === runtimeEventsTypes.HIGHLIGHT) {
        highlight()
    }

    if (request.type === runtimeEventsTypes.SET_BADGE_COUNT) {
        if (!request.data || !request.data.numInsights) {
            return
        }

        setBadgeCount(request.data.numInsights)
    }
})