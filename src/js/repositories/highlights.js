/*
    The insights repository to store and handle insights retrieved from the
    insights API.

    This repository uses chrome storage to store these insights during and
    between user sessions for reuse to avoid unnecessary API calls.
*/

/**
 * Persists valid insights from the provided URL, and calls the provided
 * callback on success
 * 
 * @param {String} url The page's URL
 * @param {Array} validInsights The pages's valid insights
 * @param {Function} callback The callback
 */
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

/**
 * Returns the stored valid insights from the provided URL, and calls the
 * provided callback on success
 * 
 * @param {String} url The page's URL from which to retrieve stored insights
 * @param {Function} callback The callback
 */
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

/**
 * Returns the number of stored valid insights from the provided URL, and calls
 * the provided callback on success
 * 
 * @param {String} url The page's URL from which to retrieve the insight count
 * @param {Function} callback The callback
 */
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
/**
 * Clears the insight store
 */
export function clear () {
    window.chrome.storage.local.remove('highlights')
}

/**
 * Clears all insights from URL's that have not been accessed in the last
 * 7 days. This is to prevent chrome storage from being bloated with unnecessary
 * storage
 */
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
            // If the insights have not been accessed recently, clear them
            if (highlightsInfo["lastAccessed"] < expireTime) {
                delete highlights[url]
            }
        })

        window.chrome.storage.local.set({highlights: highlights})
    })
}