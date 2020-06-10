import React from "react"

import { Image } from 'semantic-ui-react'

import banner from "images/banner.png"

import 'styles/layouts/layout.sass'

export default class Layout extends React.Component {
    render() {
        return (
            <div styleName='layout'>
                <Image src={banner} styleName='banner'/>
                { this.props.children }
            </div>
        )
    }
}