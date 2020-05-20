import 'images/icon-128.png'
import 'images/icon-34.png'

console.log("YOoo");

// import secrets from "secrets"

let accessToken = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo0MywiZXhwIjoxNTg5MzI2MTg1fQ.K-d7TvAZssPh3ePq1VaemBWoJqvfEs2m67jx-GXqBhY";
let expiresAt = 1689326185;

function setCookie(accessToken, expiresAt) {
	console.log(accessToken);
	console.log(expiresAt);

	//URL needs to be https to set secure true

	// chrome.cookies.set({
	// 	url: "https://localhost:8888",
	// 	name: "accessToken",
	// 	value: accessToken,
	// 	secure: true,
	// 	httpOnly: true,
	// 	expirationDate: expiresAt
	// });

	// chrome.cookies.get({
	// 	url: "https://localhost:8888",
	// 	name: "accessToken"
	// }, function(cookie) {
	// 	console.log(cookie);
	// });
}

setCookie(accessToken, expiresAt);

window.chrome.runtime.onMessage.addListener(request => {
  console.log("REQUEST");
})

console.log("BACKGROUND AFTER")