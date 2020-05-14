import React from "react"
import { hot } from "react-hot-loader"

import styles from "../../styles/popup.sass"

import { Form, Button } from 'semantic-ui-react'

class SignIn extends React.Component {
  constructor(props) {
    super(props)

    this.state = { email: '', password: '', name: '' }
  }

  handleFormChange = (e, {name, value }) => {
    console.log(name, value)

    this.setState({ [name]: value })
  }

  submitForm = (e) => {
    e.preventDefault()
  }

  render () {
    const { email, password, name } = this.state

    return (
      <div>
      	<Form styleName="styles.formWrapper" onSubmit = {this.submitForm}>
      		<h3> Sign in </h3>
      		<Form.Field>
      			<label>Email</label>
      			<Form.Input type='email' placeholder='Email' name='email' value={email} onChange={this.handleFormChange}/>
      		</Form.Field>
          <Form.Field>
            <label>Password</label>
            <Form.Input type='password' placeholder='Password' name='password' value={password} onChange={this.handleFormChange}/>
          </Form.Field>
          <Button type='submit'> Sign In </Button>
      	</Form>
      </div>
    )
  }
}

export default hot(module)(SignIn)
