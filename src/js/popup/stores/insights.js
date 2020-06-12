import { observable, action } from 'mobx'

import * as runtimeEvents from 'js/utils/runtimeEvents'

import * as highlightsRepository from 'js/repositories/highlights'

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

    constructor() {
        this.init()
    }
    
    init() {
        window.chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            const activeTab = tabs[0]

            if (activeTab) {
                highlightsRepository.getInsightCount(activeTab.url, (numInsights) => {
                    console.log(numInsights)

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