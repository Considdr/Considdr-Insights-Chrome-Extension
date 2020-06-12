import React from 'react'

import { Grid, Button } from 'semantic-ui-react'

import buttons from "styles/buttons.sass"

const InsightsDisplay = (props) => {
    return(
        <Grid centered padded="vertically">
            { props.numInsights &&
                <div>
                    <h2> {props.numInsights} </h2>
                    <h5> insights found</h5>
                </div>
            }

            <Button
                onClick={ props.highlight }
                styleName="buttons.base"
                content="Highlight Insights"
            />
        </Grid>
    )  
}

export default InsightsDisplay