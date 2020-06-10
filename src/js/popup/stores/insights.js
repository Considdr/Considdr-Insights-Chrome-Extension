import { observable, action } from 'mobx'

import * as runtimeEvents from 'js/utils/runtimeEvents'
import * as highlightsRepository from 'js/repositories/highlights'

export default class Insights {
    @observable isLoading = false
    @observable numInsights = undefined

    @action setIsLoading(status) {
        this.isLoading = status
    }

    @action updateNumInsights(numInsights) {
        this.numInsights = numInsights
        this.setIsLoading(false)
    }

    constructor() {
        this.load()
    }
    
    load() {
        window.chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            const activeTab = tabs[0]
            if (activeTab) {
                this.updateNumInsights(highlightsRepository.get(activeTab.id))
            }
        })
    }

    highlight() {
        this.setIsLoading(true)
        runtimeEvents.highlight()
    }


}