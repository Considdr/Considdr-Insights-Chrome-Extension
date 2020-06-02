import React from "react"
import { hot } from "react-hot-loader"

export default class Layout extends React.Component {
    render() {
        return (
            <div>
                { this.props.children }
            </div>
        )
    }
}