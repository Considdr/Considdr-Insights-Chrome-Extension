import React, { useState, useEffect } from 'react'

import * as autoHighlightRepository from 'js/repositories/autoHighlight'

import { Checkbox } from 'semantic-ui-react'

/**
 * Function component responsible for displaying and handling user interaction
 * with the auto highlight checkbox
 */
const AutoHighlight = () => {
    const [autoHighlight, setAutoHighlight] = useState(false)

    const handleAutoHighlightChange = (e, { checked }) => {
        autoHighlightRepository.set(checked, function(status) {
            setAutoHighlight(status)
        })
    }

    /**
     * Check for the user's current auto highlight state after the component
     * has been rendered and set the checkbox accordingly
     */
    useEffect(() => {
        autoHighlightRepository.get(function(status) {
            (status === undefined) ? false : status
            setAutoHighlight(status)
        })
    });

    return (
        <Checkbox
            label='Automatically highlight pages'
            checked={autoHighlight}
            onChange={handleAutoHighlightChange}
        />
    )
}

export default AutoHighlight