import wretch from "wretch"
import secrets from "secrets"

import $ from 'jquery'
import 'jquery.marker-animation'

import * as runtimeEvents from 'js/utils/runtimeEvents'

import * as highlightsRepository from 'js/repositories/highlights'

const endpoint = wretch()
  .url(secrets.apiEndpoint)

var punctuationRegex = new RegExp(/[.,—’“'\/#!$%\^&\*;:{}=\-_`~()”]/g)

function highlightInsights() {
	var validInsights = []

	insights.forEach(function(insight) {
		var element

		console.log(insight);

		[element, insight] = findInsight(insight)
		
		if (element === undefined || element.get().length === 0) {
			console.log("NOT FOUND")
			return;
		}

		try {
			if (highlightInsight(element, insight)) {
				validInsights.push(insight)
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

	highlightsRepository.persist(tabURL, validInsights, function() {
		runtimeEvents.highlightedPage(tabURL)
	})
}

function findInsight(insight) {
	var element = findInsightElement(insight)

	if ($(element).length) {
		return [element, insight]
	}

	insight = insight.replace(/\'/g, "’")
	insight = insight.replace(/"([^"]*)"/g, "“$1”")
	insight = insight.replace(/\"/g, "“")
	insight = insight.replace(/--/g, "—")

	element = findInsightElement(insight)
	
	if ($(element).length) {
		return [element, insight]
	} else {
		return []
	}
}

function findInsightElement(insight) {
	return $(`*:contains(${insight})`).not('script').last()
}

function constructInsightHTML(element, insight) {
	var elementHTML = element.html()
	var elementText = element.text()
	var startIndex, endIndex, indicies

	indicies = getIndicies(elementHTML, elementText, insight)

	if (!indicies) {
		return
	}

	[startIndex, endIndex] = indicies

	const highlightedHTML = elementHTML.slice(0, startIndex) + "<div class=\"marker-animation\">"
		+ elementHTML.slice(startIndex, endIndex) + "</div>" + elementHTML.slice(endIndex)

	return highlightedHTML
}

function getIndicies(elementHTML, elementText, insight) {
	var insightStartWord = getNonEmptyWord(insight, true)
	var insightEndWord = getNonEmptyWord(insight, false)

	if (!insightStartWord || !insightEndWord) {
		return
	}

	var elementTextSplit = elementText.split(insight)

	var startIndex = getIndex(elementHTML, elementTextSplit[0], insightStartWord, true)
	var endIndex = getIndex(elementHTML, elementTextSplit[0] + insight, insightEndWord, false)

	if (startIndex == -1 || endIndex == -1 || startIndex >= endIndex) {
		return
	}

	var updatedIndicies = updateIndicies(elementHTML, startIndex, endIndex)
	[startIndex, endIndex] = updatedIndicies

	return [startIndex, endIndex]
}

function getIndex(elementHTML, text, word, start) {
	var index = findIndex(elementHTML, text, word, start)

	if (index != -1) {
		return start ? index : index + word.length
	}

	word = clearPunctuation(word, start)

	index = findIndex(elementHTML, text, word, start)

	if (index == -1) {
		return index
	}

	return start ? index : index + word.length
}

function clearPunctuation(word, start) {
	if (start) {
		while (word[0].match(punctuationRegex)) {
			word = word.slice(1);
		}
	} else {
		while (word[word.length-1].match(punctuationRegex)) {
			word = word.slice(0,-1);
		}
	}

	return word
}


function findIndex(elementHTML, text, word, start) {
	var wordCount = (text.match(new RegExp(escapePunctuation(word), 'g'))|| []).length

	if (start) {
		wordCount += 1
	}

	return nthIndex(elementHTML, word, wordCount)
}

function updateIndicies(elementHTML, startIndex, endIndex) {
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
	return text.replace(punctuationRegex,"\\$&")
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

	if (element.html().indexOf(insightHTML) > -1) {
		return true
	}

	if ($.parseHTML(insightHTML)) {
		element.html(insightHTML)
		return true
	}

	return false
}

highlightInsights()