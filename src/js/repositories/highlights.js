export function persist (tabId, numInsights) {
    let highlights = JSON.parse(localStorage.getItem('highlights')) || {}

    highlights[tabId] = numInsights

    localStorage.setItem('highlights', JSON.stringify(highlights))
}

export function get (tabId) {
    let highlights = JSON.parse(localStorage.getItem('highlights')) || {}

    if (tabId in highlights) {
        return highlights[tabId]
    } else {
        return
    }
}

export function remove (tabId) {
    let highlights = JSON.parse(localStorage.getItem('highlights')) || {}

    if (tabId in highlights) {
        delete highlights[tabId]
        localStorage.setItem('highlights', JSON.stringify(highlights))
    }
}