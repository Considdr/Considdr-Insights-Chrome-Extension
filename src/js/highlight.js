import $ from 'jquery';
import markerAnimation from 'jquery.marker-animation'

const apiEndpoint = "http://localhost:8888/v1/get_work_insights";

function getInsights(url) {
	var endpoint = buildRequest(url);
	fetchInsights(endpoint);
}

function fetchInsights(endpoint) {
	fetch(endpoint)
	.then(validateResponse)
	.then(readResponseAsJSON)
	.then(processResult)
	.catch(function(error) {
		console.log('Looks like there was a problem: \n', error);
	});
}

function validateResponse(response) {
	if (!response.ok) {
		throw Error(response.statusText);
	}

	return response;
}

function readResponseAsJSON(response) {
	return response.json();
}

function processResult(response) {
	console.log("HERE")

	if (!response["data"] || !response["data"]["insights"]) {
		return;
	}

	console.log("PROCESSING")

	let insights = response["data"]["insights"].map(item => item.name);
	highlightInsights(insights);
}

function highlightInsights(insights) {
	insights.forEach(function(insight) {
		console.log(insight);
		var element = findInsight(insight);

		if (element === undefined || element.get().length === 0) {
			console.log("NOT FOUND");
			return;
		}
		
		highlightInsight(element, insight);
	});

	$('.marker-animation').markerAnimation({
	    font_weight: null
	});
}

function highlightInsight(element, insight) {
	var context = element.text().split(`${insight}`);
	var highlightedContent;

	highlightedContent = (context[0] + `<div class="marker-animation"> ${insight} </div>` + context[context.length - 1]);

	// if (context.length == 1) {
	// 	highlightedContent = `<div class="marker-animation"> ${insight} </div>`
	// } else {
	// 	
	// }

	element.html(highlightedContent);
}

function main() {
	let url = window.location.toString();
	getInsights(url);
}

function buildRequest(url) {
	var endpoint = new URL(apiEndpoint);
	endpoint.searchParams.append("work_url", url);

	return endpoint;
}

function findInsight(insight) {
	var element = $(`*:contains(${insight})`).last();

	if ($(element).length) {
		return element;
	}

	insight = insight.replace("\'", "’");

	element = $(`*:contains(${insight})`).last();

	if ($(element).length) {
		return element;
	} else {
		return;
	}

}

main();


