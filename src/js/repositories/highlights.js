export function persist (tabId, numInsights) {
    let highlights = JSON.parse(window.sessionStorage.getItem('highlights')) || {}

    highlights[tabId] = numInsights

    window.sessionStorage.setItem('highlights', JSON.stringify(highlights))
}

export function get (tabId) {
    console.log(tabId)

    let highlights = JSON.parse(window.sessionStorage.getItem('highlights')) || {}

    if (tabId in highlights) {
        return highlights[tabId]
    } else {
        return
    }
}

export function remove (tabId) {
    let highlights = JSON.parse(window.sessionStorage.getItem('highlights')) || {}

    if (tabId in highlights) {
        delete highlights[tabId]
    }
}