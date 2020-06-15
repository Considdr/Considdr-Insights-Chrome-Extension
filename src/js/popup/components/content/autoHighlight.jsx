import React, { useState, useEffect } from 'react'

import * as autoHighlightRepository from 'js/repositories/autoHighlight'

import { Checkbox } from 'semantic-ui-react'

const AutoHighlight = (props) => {
    const [autoHighlight, setAutoHighlight] = useState(false)

    const handleAutoHighlightChange = (e, { checked }) => {
        autoHighlightRepository.set(checked, function(status) {
            setAutoHighlight(status)
        })
    }

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