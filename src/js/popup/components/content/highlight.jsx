import React from 'react'

import * as runtimeEvents from 'js/utils/runtimeEvents'

import { Button } from 'semantic-ui-react'

const Highlight = () => {
    const highlight = () => {
        runtimeEvents.highlight()
    }

    return(
        <Button onClick={highlight}> Highlight</Button>
    )  
}

export default Highlight