import React from "react"
import icon from "images/icon-128.png"
import { hot } from "react-hot-loader"

import styles from "../../../../styles/popup.sass"

import { Form, Button } from 'semantic-ui-react'

class SignIn extends React.Component {
  constructor(props) {
    super(props)
    this.state = { email: '', password: '' }
  }

  handleFormChange = (e, {name, value }) => {
    this.setState({ [name]: value })
  }

  submitForm = (e) => {
    let accessToken = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo0MywiZXhwIjoxNTg5MzI2MTg1fQ.K-d7TvAZssPh3ePq1VaemBWoJqvfEs2m67jx-GXqBhY";
    let expiresAt = 1689326185;

    chrome.cookies.set({
      url: "https://localhost:8888",
      name: "accessToken",
      value: accessToken,
      secure: true,
      httpOnly: true,
      expirationDate: expiresAt
    });

    e.preventDefault()
  }

  render () {
    const { email, password } = this.state

    return (
      <div>
      	<Form styleName="styles.formWrapper" onSubmit = {this.submitForm}>
      		<h3> Sign in </h3>
      		<Form.Field>
      			<label>Email</label>
      			<Form.Input type='email' placeholder='Email' name='email' value={email} onChange={this.handleFormChange}/>
      		</Form.Field>
          <Button type='submit'> Sign In </Button>
      	</Form>
      </div>
    )
  }
}

export default hot(module)(SignIn)
