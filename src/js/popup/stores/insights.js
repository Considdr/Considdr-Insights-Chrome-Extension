import { observable, action } from 'mobx'

import * as runtimeEvents from 'js/utils/runtimeEvents'

import * as highlightsRepository from 'js/repositories/highlights'

/**
 * The Insights store, responsible for storing and handling insights
 */
export default class Insights {
    @observable isLoading = true
    @observable numInsights = null

    @action setIsLoading(status) {
        this.isLoading = status
    }

    @action updateNumInsights(numInsights) {
        this.numInsights = numInsights
        this.setIsLoading(false)
    }

    /**
     * On store initialization, set the number of insights for the current tab
     */
    constructor() {
        this.load()
    }
    
    /**
     * Get the number of insights for the current tag
     */
    load() {
        window.chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            const activeTab = tabs[0]

            if (activeTab) {
                highlightsRepository.getInsightCount(activeTab.url, (numInsights) => {
                    this.updateNumInsights(numInsights)
                })
            }
        })
    }

    highlight() {
        this.setIsLoading(true)
        runtimeEvents.highlight()
    }
}