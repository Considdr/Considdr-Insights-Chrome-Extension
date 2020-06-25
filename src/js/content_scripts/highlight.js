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
  * @param {string} insight - The insight of which we want to find
  * the parent element
  * @return {Array} - Element containing insight and the identified insight text 
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
  * @param {string} insight - The insight of which we want to find
  * the parent element
  * @return {Element} - Element containing insight and the identified
  * insight text 
*/
function findInsightElement(insight) {
	return $(`*:contains(${insight})`).not('script').last()
}

/**
  * Computes the start and end index of the insight and reconstructs the
  * element HTML to wrap the insight in the highlight animation div
  * 
  * @param {Element} element - The element containing the input insight
  * @param {string} insight - Input insight 
  * @return {string} - Reconstructed element HTML, with the insight wrapped in
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
  * @param {string} elementHTML - The parent element html
  * @param {string} elementText - The parent element text 
  * @param {string} insight - The input insight
  * 
  * @return {Array} - Start and end index of the input insight in its parent
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

/**
  * Wrapper function that returns the start or end index of the insight in the
  * element HTML.
  * 
  * This function finds the index of appropriate instance of either either the
  * start or end word of the insight (if start, then find the first instance,
  * if end, then find the last instance). If it cannot find the index at first,
  * the function will clear the appropriate puntuation of the word and try to
  * find the index again.
  * 
  * @param {string} elementHTML - The parent element html
  * @param {string} text - The text in which to find the word
  * @param {string} word - The start of end word to find the index of
  * @param {boolean} start - Whether to find start or end index
  * 
  * @return {number} - the start or end index
*/
function getIndex(elementHTML, text, word, start) {
	var index = findIndex(elementHTML, text, word, start)

	if (index != -1) return start ? index : index + word.length

	/*
		If index not found, clear the appropriate punctuation of the word and
		try again
	*/
	word = clearEndPunctuation(word, start)

	index = findIndex(elementHTML, text, word, start)

	if (index == -1) return index

	return start ? index : index + word.length
}

/**
  * Clears the appropriate punctuation of the word to be found
  * 
  * @param {string} word - The start of end word
  * @param {boolean} start - Whether to clear the head or tail punctuation
  * 
  * @return {string} - the word with the appropriate punctuation cleared
*/
function clearEndPunctuation(word, start) {
	if (start) {
		// If input word is the start word, clear the head puntuation 
		while (word[0].match(punctuationRegex)) {
			word = word.slice(1);
		}
	} else {
		// Otherwise clear the tail punctuation
		while (word[word.length-1].match(punctuationRegex)) {
			word = word.slice(0,-1);
		}
	}

	return word
}

/**
  * Finds and returns the start or end index of the insight in the element HTML.
  * 
  * This function finds the index of appropriate instance of either either the
  * start or end word of the insight (if start, then find the first instance,
  * if end, then find the last instance).
  * 
  * @param {string} elementHTML - The parent element html
  * @param {string} text - The text in which to find the word
  * @param {string} word - The start of end word to find the index of
  * @param {boolean} start - Whether to find start or end index
  * 
  * @return {number} - The start or end index
*/
function findIndex(elementHTML, text, word, start) {
	// Determine the 
	var wordCount = (
		text.match(new RegExp(escapePunctuation(word), 'g')) || []
	).length

	// TODO: TEST THIS. SHOULD IT JUST BE SET TO 1?????
	if (start) wordCount += 1

	return nthIndex(elementHTML, word, wordCount)
}

/**
  * Escapes the input word punctuation to be able to properly search for it
  * in the text
  * 
  * @param {string} text - The text in which to find the word
  * 
  * @return {string} - The start or end index
*/
function escapePunctuation(text) {
	return text.replace(punctuationRegex,"\\$&")
}

/**
  * Finds the n index of the input word in the input text
  * 
  * @param {string} text - The text in which to find the word
  * @param {string} word - The word to be found
  * @param {number} n - The index of the word to be found
  * 
  * @return {string} - The start or end index
*/
function nthIndex(text, word, n) {
	var textLength = text.length, i = -1

    while(n-- && i++ < textLength) {
        i = text.indexOf(word, i)
        if (i < 0) break;
	}
	
    return i
}

/**
  * Gets the first or last word of the input text
  * 
  * @param {string} text - The text from which to extract the first or last word
  * @param {boolean} start - Whether to find the first or last word of the
  * input text
  * 
  * @return {string} - The first or last word of the input text
*/
function getNonEmptyWord(text, start) {
	var split = text.split(" ")

	// If looking for last word, reverse the text
	if (!start) split = split.reverse()
	
	return split.find(function (val) {
		return val !== ''
	})
}

/**
  * Updates the start and end index of the insight in the parent element's HTML
  * in order to account for wrapping tags. As some insights may be wrapped in
  * partially wrapped in other tags (e.g. link tags), we also want to be able to
  * account for that wraps when highlighting the insight
  * 
  * @param {string} elementHTML - The parent element html
  * @param {number} startIndex - The current start index of the insight
  * @param {boolean} endIndex - The current end index of the insight
  * 
  * @return {Array} - The updated start and end index of the insight
*/
function updateIndicies(elementHTML, startIndex, endIndex) {
	var totalIndex = 0

	// Iterate through each of the element's DOM nodes
	$.each($.parseHTML(elementHTML), function(i, el) {
		var elementEndIndex

		if (el.outerHTML !== undefined) {
			// If a DOM node is a tag, add total length of node
			elementEndIndex = el.outerHTML.length
		} else {
			// Otherwise, just add length of text
			elementEndIndex = el.length
		}

		/*
			If the start index is within the current DOM node and the DOM node
			is a tag, set the start index to the start of the tag
		*/ 

		if (startIndex >= totalIndex &&
			startIndex <= totalIndex + elementEndIndex) {
			if (el.outerHTML !== undefined) {
				startIndex = totalIndex - 1
			}
		}
		
		/*
			If the end index is within the current DOM node and the DOM node
			is a tag, set the end index to the end of the tag
		*/ 
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

/**
  * Reconstructs the element HTML such that the insight can be wrapped in
  * the highlight animation div. 
  * 
  * @param {Element} element - The element in which the insight exists
  * @param {string} insight - The insight to highlight
  * 
  * @return {boolean} - Whether or not the insight was successfully wrapped in
  * the highlight animation div
*/
function highlightInsight(element, insight) {
	/*
		Reconstructs the HTML surrounding the insight to wrap it in
		the highlight animation div
    */ 
	const insightHTML = constructInsightHTML(element, insight)

	if (!insightHTML) {
		// If insightHTML is null, it could not be successfully wrapped
		return false
	} else if (element.html().indexOf(insightHTML) > -1) {
		// If the element has already been highlighted, ignore it
		return true
	} else if ($.parseHTML(insightHTML)) {
		element.html(insightHTML)
		return true
	}

	return false
}

highlightInsights()