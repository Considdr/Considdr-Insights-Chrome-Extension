import localize from 'fronto-localize'

/**
 * The Auth store's locale utility to store localized user messages
 */
const en = {
    empty_fields: "Please fill all fields",
    invalid_credentials: "Invalid username or password",
    unexpected_error: "There was an unexpected error"
}

export default localize({ en });