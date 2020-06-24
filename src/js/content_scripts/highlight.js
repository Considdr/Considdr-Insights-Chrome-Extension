/*
	This content script responsible for highlighting insights on a webpage. This script
	is triggered by the background script either manually by the user when clicking
	the 'Find Insights' button in the popup, or automatically when visiting a new
	page if the user has enabled automatic insight highlighting.

	Step-by-step outline:

	1. The content script is triggered by the background script (and is passed the
	insights for the current page by the background script)
	2. For each insight:
		- The element which contains the insight is identified (if it exists in the
		page HTML, i.e. is a valid insight)
		- The start and end indicies for the insight are computed
		- The HTML with the highlighting animation is constructed to wrap the
		insight
		- The constructed HTML is injected into the webpage
	3. The highlighting animation is triggered to highlight all valid insights
	4. All valid insights (i.e. insights that were found on the page) are persisted
	in chrome storage to cache for future use
*/

import $ from 'jquery'
import 'jquery.marker-animation'

import * as runtimeEvents from 'js/utils/runtimeEvents'

import * as highlightsRepository from 'js/repositories/highlights'

const punctuationRegex = new RegExp(/[.,—’“'\/#!$%\^&\*;:{}=\-_`~()”]/g)

/**
  * Identifies all valid insights on the page, wraps them in the highlight
  * animation div, triggers the highlighting animation, and persists all valid
  * insights in chrome storage.
  * 
*/
function highlightInsights() {
	var validInsights = []

	insights.forEach(function(insight) {
		var element

		[element, insight] = findInsight(insight)
		
		// If element containing insight could not be found, return
		if (element === null || element.get().length === 0) return

		try {
			/*
				If the insight could be located and highlighted in the page,
				it is a valid insight and will be persisted in chrome storage
			*/
			if (highlightInsight(element, insight)) validInsights.push(insight)
		}
		catch {
			return
		}
	});

	// Trigger highlighting animation
	$('.marker-animation').markerAnimation({
		font_weight: null,
		color: "#99dbff"
	});

	// Persist valid insights in chorme storage and notify background script
	highlightsRepository.persist(tabURL, validInsights, function() {
		runtimeEvents.highlightedPage(tabURL)
	})
}

/**
  * A wrapper function that finds and returns the element which contains the
  * input insight. As the insights being returned from the API have been decoded
  * to ASCII characters, the insight text may not match the text on the page.
  * If this is the case, this function will also check if the insight with
  * common ASCII characters replaced with common Unicode characters exists.
  * 
  * This function wraps around the jQuery function that identifies the element
  * in the page
  * 
  * @param {string} insight - the insight of which we want to find
  * the parent element
  * @return {Array} - element containing insight and the identified insight text 
*/
function findInsight(insight) {
	var element = findInsightElement(insight)

	if ($(element).length) return [element, insight]

	// Replaces 
	insight = insight.replace(/\'/g, "’")
	insight = insight.replace(/"([^"]*)"/g, "“$1”")
	insight = insight.replace(/\"/g, "“")
	insight = insight.replace(/--/g, "—")

	element = findInsightElement(insight)
	
	if ($(element).length) {
		return [element, insight]
	} else {
		return [null, insight]
	}
}

/**
  * Find and returns the element which contains the input insight
  * 
  * @param {string} insight - the insight of which we want to find
  * the parent element
  * @return {Element} - element containing insight and the identified
  * insight text 
*/
function findInsightElement(insight) {
	return $(`*:contains(${insight})`).not('script').last()
}

/**
  * Computes the start and end index of the insight and reconstructs the
  * element HTML to wrap the insight in the highlight animation div
  * 
  * @param {Element} element - the element containing the input insight
  * @param {string} insight - input insight 
  * @return {string} - reconstructed element HTML, with the insight wrapped in
  * the highlight animation div
*/
function constructInsightHTML(element, insight) {
	const elementHTML = element.html()

	// Get start and end indicies of the input insight in the input element
	const indicies = getIndicies(elementHTML, element.text(), insight)

	if (!indicies) return

	const [startIndex, endIndex] = indicies

	// Wrap insight in the highlight animation div
	return elementHTML.slice(0, startIndex) +
		"<div class=\"marker-animation\">" +
		elementHTML.slice(startIndex, endIndex) +
		"</div>" +
		elementHTML.slice(endIndex)
}

/**
  * Computes and returns the start and end index of the insight
  * 
  * @param {string} elementHTML - the parent element html
  * @param {string} elementText - the parent element text 
  * @param {string} insight - the input insight
  * 
  * @return {Array} - start and end index of the input insight in its parent
  * element
*/
function getIndicies(elementHTML, elementText, insight) {
	// Get the start and end word of the insight
	const insightStartWord = getNonEmptyWord(insight, true)
	const insightEndWord = getNonEmptyWord(insight, false)

	if (!insightStartWord || !insightEndWord) return

	const elementTextSplit = elementText.split(insight)

	// Get the start and end index of the insight in the element HTML
	var startIndex = getIndex(elementHTML, elementTextSplit[0],
		insightStartWord, true)
	var endIndex = getIndex(elementHTML, elementTextSplit[0] + insight,
		insightEndWord, false)

	if (startIndex == -1 || endIndex == -1 || startIndex >= endIndex) return

	// Update insight start and end indicies to accomodate wrapping tags
	[startIndex, endIndex] = updateIndicies(elementHTML, startIndex, endIndex)

	return [startIndex, endIndex]
}

function getIndex(elementHTML, text, word, start) {
	var index = findIndex(elementHTML, text, word, start)

	if (index != -1) return start ? index : index + word.length

	word = clearEndPunctuation(word, start)

	index = findIndex(elementHTML, text, word, start)

	if (index == -1) return index

	return start ? index : index + word.length
}

function clearEndPunctuation(word, start) {
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
	var wordCount = (
		text.match(new RegExp(escapePunctuation(word), 'g')) || []
	).length

	if (start) wordCount += 1

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

		if (startIndex >= totalIndex &&
			startIndex <= totalIndex + elementEndIndex) {
			if (el.outerHTML !== undefined) {
				startIndex = totalIndex - 1
			}
		}
		
		if (endIndex >= totalIndex &&
			endIndex <= totalIndex + elementEndIndex) {
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

	if (!start) split = split.reverse()
	
	return split.find(function (val) {
		return val !== ''
	})
}

function highlightInsight(element, insight) {
	const insightHTML = constructInsightHTML(element, insight)

	if (!insightHTML) {
		return false
	} else if (element.html().indexOf(insightHTML) > -1) {
		return true
	} else if ($.parseHTML(insightHTML)) {
		element.html(insightHTML)
		return true
	}

	return false
}

highlightInsights()