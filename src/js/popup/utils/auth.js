import secrets from "secrets";

class Auth {
	signIn(email, password) {
		let endpoint = secrets.apiEndpoint
		let url = endpoint += "auth/sessions"

		let opts = {
			email: email,
			password: password
		}

		let req = new Request(url, {
			method: 'POST',
			body: JSON.stringify(opts),
			headers: {
				'Content-Type': 'application/json'
		    }
		})

		fetch(req)
		.then(this.validateResponse)
		.then(this.readResponseAsJSON)
		.then(this.setAccessToken)
		// .then(this.getAccessToken)
		.catch(function(error) {
			console.log('Looks like there was a problem: \n', error);
		});
	}

	validateResponse(response) {
		if (!response.ok) {
			throw Error(response.statusText);
		}

		return response;
	}

	readResponseAsJSON(response) {
		return response.json();
	}

	setAccessToken(response) {
		let accessToken = response["data"]["accessToken"]
		let expiresAt = response["data"]["expiresAt"]

		chrome.cookies.set({
		  url: "https://localhost:8888",
		  name: "accessToken",
		  value: accessToken,
		  secure: true,
		  httpOnly: true,
		  expirationDate: expiresAt
		});
	}

	getAccessToken() {
		chrome.cookies.get({
		  url: "https://localhost:8888",
		  name: "accessToken"
		  }, function(cookie) {
		    if (cookie) {
		    	console.log(cookie)
		    } else {
		    	console.log("NO COOKIE")
		    }
		});
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