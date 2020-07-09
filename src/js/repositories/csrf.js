/*
    The CSRF repository to store and get the CSRF token.
*/

/**
 * Sets and stores the CSRF token, and calls the provided callback on success
 * 
 * @param {String} status The CSRF token
 * @param {Function} callback The callback
 */
export function set (csrf_token, callback) {
    window.chrome.storage.local.set({'csrf_token': csrf_token}, function() {
        callback && callback(csrf_token)
    })
}

/**
 * Returns the CSRF token, and calls the provided callback on success
 * 
 * @param {Function} callback The callback
 */
export function get (callback) {
    window.chrome.storage.local.get('csrf_token', function(data) {
        callback && callback(data.csrf_token)
    })
}

/**
 * Clears the CSRF token
 */
export function clear () {
    window.chrome.storage.local.remove('csrf_token')
}