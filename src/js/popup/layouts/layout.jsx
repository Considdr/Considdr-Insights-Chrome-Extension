import React from "react"

import { inject } from 'mobx-react'

import Footer from "./footer"

import { Image } from 'semantic-ui-react'

import banner from "images/banner.png"

import 'styles/layouts/layout.sass'

/**
 * The default app component layout
 * 
 * This layout is injected with the auth store to make the auth observables
 * avaibale as props
 */
@inject('auth')
export default class Layout extends React.Component {
    goToConsiddr = () => {
		window.chrome.tabs.update({
			url: "https://www.considdr.com/"
	   });
	}

	signOut = () => {		
		const { auth } = this.props;
		auth.signOut();
	}

    render() {
        const { auth } = this.props

        return (
            <div styleName='layout'>
                <Image src={banner} size="medium" styleName='banner'/>
                <div styleName="content">
                    { this.props.children }
                </div>
                { auth.signedIn && 
                    <Footer goToConsiddr={this.goToConsiddr} signOut={this.signOut}/>
                }
            </div>
        )
    }
}