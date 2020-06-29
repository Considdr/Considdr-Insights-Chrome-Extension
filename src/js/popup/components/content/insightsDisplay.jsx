import React from 'react'

import { Grid, Button } from 'semantic-ui-react'

import styles from "styles/components/content/insightsDisplay.sass"
import buttons from "styles/buttons.sass"

/**
 * Function component that renders the "Find Insights" button, and, if provided
 * in the props, the number of insights found on the current page
 * 
 * @param {*} props
 */
const InsightsDisplay = (props) => {
    return(
        <Grid centered padded="vertically">
            { props.numInsights !== null &&
                <div styleName='styles.insights'>
                    <h2 styleName='styles.numInsights'> {props.numInsights} </h2>
                    <h5 styleName='styles.insightsText'> insights found</h5>
                </div>
            }

            <Button
                onClick={ props.highlight }
                styleName="buttons.base"
                content="Find Insights"
            />
        </Grid>
    )  
}

export default InsightsDisplay