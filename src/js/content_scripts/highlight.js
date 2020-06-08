import wretch from "wretch"
import secrets from "secrets"

import $ from 'jquery'
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
			runtimeEvents.highlightedPage(tabId, 0)
		})
}

function processResult(response) {
	if (!response["data"] || !response["data"]["insights"]) {
		return;
	}

	let insights = response["data"]["insights"].map(item => item.name);
	highlightInsights(insights);
}

function highlightInsights(insights) {
	let numInsights = 0

	// insights = insights.splice(0,1)

	// console.log(insights)

	insights.forEach(function(insight) {
		var element

		[element, insight] = findInsight(insight)

		console.log(insight)

		if (element === undefined || element.get().length === 0) {
			console.log("NOT FOUND");
			return;
		}

		try {
			if (highlightInsight(element, insight)) {
				numInsights++
			}
		}
		catch {
			return
		}
	});

	$('.marker-animation').markerAnimation({
		font_weight: null,
		color: "#99dbff"
	});

	runtimeEvents.highlightedPage(tabId, numInsights)
}

function findInsight(insight) {
	var element = findInsightElement(insight)

	if ($(element).length) {
		return [element, insight]
	}

	insight = insight.replace("\'", "’")
	insight = insight.replace(/"([^"]*)"/g, "“$1”")
	insight = insight.replace("\"", "“")
	insight = insight.replace("--", "—")

	element = findInsightElement(insight)
	
	if ($(element).length) {
		return [element, insight]
	} else {
		return
	}
}

function findInsightElement(insight) {
	return $(`*:contains(${insight})`).last()
}

function constructInsightHTML(element, insight) {
	const elementHTML = element.html()
	const elementText = element.text()
	var startIndex, endIndex, indicies

	console.log(elementText)

	try {
		indicies = getIndicies(elementHTML, elementText, insight)
	}
	catch {
		return
	}

	if (!indicies) {
		return
	}

	[startIndex, endIndex] = indicies

	if (startIndex == -1 || endIndex == -1) {
		return
	}

	const highlightedHTML = elementHTML.slice(0, startIndex) + "<div class=\"marker-animation\">"
		+ elementHTML.slice(startIndex, endIndex) + "</div>" + elementHTML.slice(endIndex)

	return highlightedHTML
}

function getIndicies(elementHTML, elementText, insight) {
	const insightStartWord = getNonEmptyWord(insight, true)
	const insightEndWord = getNonEmptyWord(insight, false)

	if (!insightStartWord || !insightEndWord) {
		return
	}

	const elementTextSplit = elementText.split(insight)
	const startWordCount = (elementTextSplit[0].match(new RegExp(escapePunctuation(insightStartWord)))|| []).length
	const endWordCount = ((elementTextSplit[0] + insight).match(new RegExp(escapePunctuation(insightEndWord)))|| []).length

	var startIndex = nthIndex(elementHTML, insightStartWord, startWordCount + 1)
	var endIndex = nthIndex(elementHTML, insightEndWord, endWordCount) + insightEndWord.length

	console.log(startIndex)
	console.log(endIndex)

	if (startIndex == -1 || endIndex == -1) {
		return
	}

	var totalIndex = 0
	$.each($.parseHTML(elementHTML), function(i, el) {
		var elementEndIndex

		if (el.outerHTML !== undefined) {
			elementEndIndex = el.outerHTML.length
		} else {
			elementEndIndex = el.length
		}

		if (startIndex >= totalIndex && startIndex <= totalIndex + elementEndIndex) {
			if (el.outerHTML !== undefined) {
				startIndex = totalIndex - 1
			}
		}
		
		if (endIndex >= totalIndex && endIndex <= totalIndex + elementEndIndex) {
			if (el.outerHTML !== undefined) {
				endIndex = totalIndex + elementEndIndex
			}
		}

		totalIndex += elementEndIndex
	});

	return [startIndex, endIndex]
}

function escapePunctuation(text) {
	return text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"\\$&")
}

function nthIndex(text, word, n) {
	var textLength = text.length, i = -1

    while(n-- && i++ < textLength) {
        i = text.indexOf(word, i)
        if (i < 0) break;
	}
	
    return i
}

function getNonEmptyWord(text, start) {
	var split = text.split(" ")

	if (!start) {
		split = split.reverse()
	}
	
	return split.find(function (val) {
		return val !== ''
	})
}

function highlightInsight(element, insight) {
	const insightHTML = constructInsightHTML(element, insight)

	if (!insightHTML) {
		return false
	}

	if ($.parseHTML(insightHTML)) {
		element.html(insightHTML)
		return true
	}

	return false
}

function main() {
	let url = window.location.toString();
	getInsights(url);
}

main()