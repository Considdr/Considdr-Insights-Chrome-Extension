import React from 'react'

import { List, Image } from 'semantic-ui-react'

import logo from "images/icon-128.png"

import "styles/components/content/footer.sass"

const Footer = (props) => {
    return (
        <List bulleted horizontal styleName="footer">
            <List.Item as='a' onClick={props.goToConsiddr}>
                <Image avatar src={logo} />
            </List.Item>
            <List.Item as='a' onClick={props.signOut}>Sign Out</List.Item>
        </List>
    )
}

export default Footer



