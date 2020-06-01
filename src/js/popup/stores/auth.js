import { observable, action } from 'mobx'

export default class Auth {
	@observable isLoading = false

	@observable currentUser = {}
	@observable signedIn = false

	constructor(api) {
		this.api = api
	}

	@action setIsLoading(status) {
		this.isLoading = status
	}

	@action setSignedIn(status) {
		this.signedIn = status
	}

	@action signInUser(body) {
		this.setSignedIn(true)
		this.currentUser = body.data.user
	}

	@action signOutUser() {
		this.setSignedIn(false)
		this.currentUser = {}
	}

	validate() {
		this.setIsLoading(true)

		this.api
			.url("/auth/sessions")
			.get()
			.json(json => {
				this.signInUser(json)
				this.setIsLoading(false)
			})
			.catch(() => {
				this.signOutUser()
			})
	}

	signIn(email, password) {
		this.setIsLoading(true)

		this.api
			.url("/auth/sessions")
			.post({
				email: email,
				password: password
			})
			.json(json => {
				this.signInUser(json)
				this.setIsLoading(false)
			})
	}

	signOut() {
		this.api
			.url("/auth/sessions")
			.delete()
			.res(() => {
				this.signOutUser()
			})
	}
}