import wretch from "wretch";
import secrets from "secrets";

import $ from 'jquery';
import 'jquery.marker-animation'

import * as runtimeEvents from 'js/utils/runtimeEvents'

const endpoint = wretch()
  .url(secrets.apiEndpoint)

function getInsights(url) {
	endpoint
		.url("/get_work_insights")
		.query({
			work_url: url
		})
		.get()
		.json(json => {
			processResult(json)
		})
		.catch(error => {
			console.log('Looks like there was a problem: \n', error);
		})
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
	let numInsights = 0

	insights.forEach(function(insight) {
		console.log(insight);
		var element = findInsight(insight);

		if (element === undefined || element.get().length === 0) {
			console.log("NOT FOUND");
			return;
		}

		numInsights++
		
		highlightInsight(element, insight);
	});

	$('.marker-animation').markerAnimation({
	    font_weight: null
	});

	runtimeEvents.setBadgeCount(numInsights)
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

main();