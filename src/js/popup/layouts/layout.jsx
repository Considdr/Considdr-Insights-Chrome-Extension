import React from "react"

import 'styles/layouts/layout.sass'

export default class Layout extends React.Component {
    render() {
        return (
            <div styleName='layout'>
                { this.props.children }
            </div>
        )
    }
}