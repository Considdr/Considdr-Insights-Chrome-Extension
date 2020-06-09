import React from "react"

import { observer, inject } from 'mobx-react'

import Layout from "js/popup/layouts/layout"

import { Image, Form, Button } from 'semantic-ui-react'

import secrets from "secrets";

import banner from "images/banner.png"

import styles from "styles/components/auth/sign_in.sass"
import buttons from "styles/buttons.sass"

@inject('auth') @observer
export default class SignIn extends React.Component {
  constructor(props) {
    super(props)

    this.state = { email: secrets.email, password: secrets.password }
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value })
  }

  submitForm = (e) => {
    e.preventDefault()

    const { auth } = this.props
    const { email, password } = this.state

    if (email === '' || password === '') {
      return
    }

    auth.signIn(email, password)
  }

  render () {
    const { auth } = this.props
    const { isLoading } = auth
    const { email, password } = this.state

    return (
      <Layout>
        <Image src={banner}/>
      	<Form onSubmit = {this.submitForm} styleName="styles.signInForm">
          <Form.Field>
            <Form.Input label="Email" type="email" placeholder='Email' name='email' value={email} onChange={this.handleChange}/>
          </Form.Field>
          <Form.Field>
            <Form.Input label="Password" type="password" placeholder='Password' name='password' value={password} onChange={this.handleChange}/>
          </Form.Field>
          <Button type='submit' styleName="buttons.base"> Sign In </Button>
      	</Form>
      </Layout>
    )
  }
}