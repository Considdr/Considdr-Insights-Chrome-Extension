import { observable, action } from 'mobx'

import t from "./locale";

export default class Auth {
	@observable isLoading = false

	@observable currentUser = {}
	@observable signedIn = false

	@observable message = null

	constructor(api) {
		this.api = api
	}

	@action setIsLoading(status) {
		this.isLoading = status
	}

	@action setSignedIn(status) {
		this.signedIn = status
	}

	@action setMessage(message) {
		this.message = message
	}

	@action signInUser(body) {
		this.setSignedIn(true)
		this.currentUser = body.data.user
		this.setMessage(null)
		this.setIsLoading(false)
	}

	@action signOutUser() {
		this.setSignedIn(false)
		this.currentUser = {}
		this.setMessage(null)
		this.setIsLoading(false)
	}

	@action handleError(message) {
		this.setMessage({
			body: t(message),
			type: "error"
		})

		this.setIsLoading(false)
	}

	validate() {
		this.setIsLoading(true)

		this.api
			.url("/auth/sessions")
			.get()
			.json(json => {
				this.signInUser(json)
			})
			.catch(() => {
				this.signOutUser()
			})
	}

	signIn(email, password) {
		this.setIsLoading(true)

		this.api
			.url("/auth/sessions")
			.content("application/json")
			.post({
				email: email,
				password: password
			})
			.json(json => {
				this.signInUser(json)
			})
			.catch(error => {
				var errorMessage

				try {
					errorMessage = JSON.parse(error.message).data.error
				} catch {
					errorMessage = "server_error"
				}

				this.handleError(errorMessage)
			})
	}

	signOut() {
		this.setIsLoading(true)

		this.api
			.url("/auth/sessions")
			.delete()
			.res(() => {
				this.signOutUser()
			})
	}
}