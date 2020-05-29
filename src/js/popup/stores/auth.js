import { observable, action, computed } from 'mobx'
import secrets from "secrets";

class Auth {
	@observable signedIn = false
	@observable isLoading = false

	@action setIsLoading(status) {
		this.isLoading = status
	}

	@action setSignedIn(status) {
		this.signedIn = status
	}

	constructor(api) {
		this.api = api
	}

	signIn(email, password, callback) {
		this.setIsLoading(true)

		this.api
			.url("/auth/sessions")
			.post({
				email: email,
				password: password
			})
			.res(() => {
				this.setIsLoading(false)
				this.setSignedIn(true)
			})
	}

	signOut() {
		this.setSignedIn(false)
	}

	// validate() {
	// 	var signedIn = true

	// 	chrome.cookies.get({
	// 	  url: "https://localhost:8888",
	// 	  name: "accessToken"
	// 	  }, function(cookie) {
	// 	    if (cookie) {
	// 	    	console.log(cookie)
	// 	    	signedIn = true
	// 	    } else {
	// 	    	signedIn = false
	// 	    }
	// 	});

	// 	return signedIn
	// }
}

export default Auth