export function persist (tabId, numInsights) {
    console.log("PERSIST")

    window.chrome.storage.local.get(['highlights'], function(data) {
        var highlights = data.highlights

        if (!highlights) {
            highlights = {}
        }

        highlights[tabId] = numInsights
        window.chrome.storage.local.set({highlights: highlights})
    })
}

export function get (tabId, callback) {
    window.chrome.storage.local.get(['highlights'], function(data) {
        var highlights = data.highlights

        if (!highlights) {
            highlights = {}
        }

        callback && callback(highlights[tabId])
    })
}

export function remove (tabId) {
    window.chrome.storage.local.get(['highlights'], function(data) {
        var highlights = data.highlights

        if (!highlights) {
            highlights = {}
        }

        if (tabId in highlights) {
            delete highlights[tabId]
            window.chrome.storage.local.set({highlights: highlights})
        }
    })    
}