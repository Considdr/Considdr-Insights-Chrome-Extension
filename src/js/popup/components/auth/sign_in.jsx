import React from "react"

import { observer, inject } from 'mobx-react'

import Layout from "js/popup/layouts/layout"

import { Form, Button } from 'semantic-ui-react'

import secrets from "secrets";

import styles from "styles/components/auth/sign_in"

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
      	<Form onSubmit = {this.submitForm}>
      		<h3> Sign In </h3>
          <Form.Field>
            <Form.Input label="Email" type="email" placeholder='Email' name='email' value={email} onChange={this.handleChange}/>
          </Form.Field>
          <Form.Field>
            <Form.Input label="Password" type="password" placeholder='Password' name='password' value={password} onChange={this.handleChange}/>
          </Form.Field>
          <Form.Input/>
          <Form.Input/>
          <Button type='submit'> Sign In </Button>
      	</Form>
      </Layout>
    )
  }
}