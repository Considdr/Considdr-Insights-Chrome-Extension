/*
    The auto highlight repository to store and update a user's auto highlight
    preference.

    This repository uses chrome storage to store this preference during and
    between user sessions.
*/

/**
 * Sets and stores the user's auto highlight preference, and calls the provided
 * callback on success
 * 
 * @param {boolean} status The status to which auto highlight is being set
 * @param {Function} callback The callback
 */
export function set (status, callback) {
    window.chrome.storage.local.set({'autoHighlight': status}, function() {
        callback && callback(status)
    })
}

/**
 * Returns the user's auto highlight preference, and calls the provided
 * callback on success
 * 
 * @param {Function} callback The callback
 */
export function get (callback) {
    window.chrome.storage.local.get('autoHighlight', function(data) {
        callback && callback(data.autoHighlight)
    })
}

/**
 * Clears the user's auto highlight preference
 */
export function clear () {
    window.chrome.storage.local.remove('autoHighlight')
}