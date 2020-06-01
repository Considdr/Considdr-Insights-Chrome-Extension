import { observable, action, computed } from 'mobx'
import secrets from "secrets";

class Auth {
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

	@action setCurrentUser(body) {
		this.setSignedIn(true)
		this.currentUser = body.data.user
	}

	validate() {
		this.setIsLoading(true)

		this.api
			.url("/auth/sessions")
			.get()
			.json(json => {
				this.setCurrentUser(json)
				this.setIsLoading(false)
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
				this.setCurrentUser(json)
				this.setIsLoading(false)
			})
	}

	signOut() {
		this.setSignedIn(false)
	}
}

export default Auth