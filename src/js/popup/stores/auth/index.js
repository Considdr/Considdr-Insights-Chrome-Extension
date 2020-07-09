import { observable, action } from 'mobx'

import * as runtimeEvents from 'js/utils/runtimeEvents'

import * as csrfRepository from 'js/repositories/csrf'

import t from "./locale";

/**
 * The Auth store, responsible for storing and handling user authentication
 */
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
		csrfRepository.set(body.data.csrf_token)
		this.setMessage(null)
		this.setIsLoading(false)
	}

	@action signOutUser() {
		this.setSignedIn(false)
		this.currentUser = {}
		this.setMessage(null)
		this.setIsLoading(false)
		csrfRepository.clear()

		runtimeEvents.signOut()
	}

	@action handleError(message) {
		// The appropriate message will be set on an authentication error
		this.setMessage({
			body: t(message),
			type: "error"
		})

		this.setIsLoading(false)
	}

	/**
	 * Validates that the user is signed in on app rendering
	 */
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
					errorMessage = "unexpected_error"
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
			.catch(error => {})
	}
}