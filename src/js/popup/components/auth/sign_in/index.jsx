import React from "react"

import { observer, inject } from 'mobx-react'

import Layout from "js/popup/layouts/layout"

import { Form, Button, Message } from 'semantic-ui-react'

import secrets from "secrets"; //REMOVE THIS

import styles from "styles/components/auth/sign_in.sass"
import buttons from "styles/buttons.sass"

@inject('auth') @observer
export default class SignIn extends React.Component {
  constructor(props) {
    super(props)

    this.state = { email: secrets.email, password: secrets.password } //REMOVE INITIAL
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value })
  }

  submitForm = (e) => {
    e.preventDefault()

    const { auth } = this.props
    const { email, password } = this.state

    if (email === '' || password === '') {
      auth.handleError("empty_fields")
      return
    }

    auth.signIn(email, password)
  }

  render () {
    const { auth } = this.props
    const { message } = auth

    const { email, password } = this.state

    return (
      <Layout>
      	<Form onSubmit = {this.submitForm} styleName="styles.signInForm" error>
          <Form.Field>
            <Form.Input fluid icon='user' iconPosition='left' type="email" placeholder='Email' name='email' value={email} onChange={this.handleChange}/>
          </Form.Field>
          <Form.Field>
            <Form.Input fluid icon='lock' iconPosition='left' type="password" placeholder='Password' name='password' value={password} onChange={this.handleChange}/>
          </Form.Field>
            {
              message &&
                <Message error size='tiny' header="Error" content={message.body}/>
            }
          <Button type='submit' styleName="buttons.base"> Sign In </Button>
      	</Form>
      </Layout>
    )
  }
}