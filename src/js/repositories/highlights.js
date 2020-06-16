export function persist (url, validInsights, callback) {
    if (!url || !validInsights) return

    window.chrome.storage.local.get('highlights', function(data) {
        var highlights

        try {
            highlights = JSON.parse(data.highlights)
        } catch {
            highlights = {}
        }

        highlights[url] = {
            insights: validInsights,
            numInsights: validInsights.length,
            lastAccesssed: Date.now()
        }

        window.chrome.storage.local.set({highlights: JSON.stringify(highlights)})

        callback && callback()
    })
}

export function getInsights (url, callback) {
    if (!url) return

    window.chrome.storage.local.get('highlights', function(data) {
        var highlights, insights

        try {
            highlights = JSON.parse(data.highlights)
        } catch {
            highlights = {}
        }

        if (url in highlights) {
            insights = highlights[url]["insights"]
            highlights[url]["lastAccessed"] = Date.now()
        } else {
            insights = null
        }

        callback && callback(insights)
    })
}

export function getInsightCount (url, callback) {
    if (!url) return

    window.chrome.storage.local.get('highlights', function(data) {
        var highlights, numInsights

        try {
            highlights = JSON.parse(data.highlights)
        } catch {
            highlights = {}
        }

        if (url in highlights) {
            numInsights = highlights[url]["numInsights"]
            highlights[url]["lastAccessed"] = Date.now()
        } else {
            numInsights = null
        }

        callback && callback(numInsights)
    })
}

export function clear () {
    window.chrome.storage.local.remove('highlights')
}

export function clearUnaccessed () {
    window.chrome.storage.local.get('highlights', function(data) {
        var highlights

        try {
            highlights = JSON.parse(data.highlights)
        } catch {
            highlights = {}
        }

        var date = new Date()
        const expireTime = date.setDate(date.getDate() - 7)

        Object.entries(highlights).forEach(([url, highlightsInfo]) => {
            if (highlightsInfo["lastAccessed"] < expireTime) {
                delete highlights[url]
            }
        })

        window.chrome.storage.local.set({highlights: highlights})
    })
}