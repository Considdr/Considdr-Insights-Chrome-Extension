import React from 'react'

import { Button } from 'semantic-ui-react'

import buttons from "styles/buttons.sass"

const Highlight = (props) => {
    const { highlight } = props

    return(
        <Button onClick={ highlight } styleName="buttons.base"> Highlight Insights </Button>
    )  
}

export default Highlight