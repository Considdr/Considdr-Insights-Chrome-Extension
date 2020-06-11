export function set (status, callback) {
    window.chrome.storage.local.set({'autoHighlight': status}, function() {
        callback && callback(status)
    })
}

export function get (callback) {
    window.chrome.storage.local.get('autoHighlight', function(data) {
        callback && callback(data.autoHighlight)
    })
}