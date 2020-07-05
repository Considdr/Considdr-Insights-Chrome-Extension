# Considdr Insights

A Chrome extension that highlights the key insights in documents across the web.

**This extension is pending approval in the Chrome Web Store**

<img src="considdr-insights.gif">

This extension interfaces with Considdr's Insights API (built in tandem with this project) to retrieve insights for a specific page. This is a REST API built using AWS Lambda and AWS API Gateway. The API is proprietary and not available on GitHub.

This extension requires a Considdr account in order to log in and highlight insights. Please reach out to us at [support@considdr.com](mailto:support@considdr.com) to get demo access to the extension.

Below are some good articles to test the extension on:
- https://www.vox.com/2018/6/22/17489516/male-politics-reporters-only-tweet-other-men-nikki-usher
- https://chicago.suntimes.com/2020/6/15/21287310/eggs-health-nutrition-cholesterol-protein-diet-heart-health
- https://www.eurekalert.org/pub_releases/2020-06/uog-hps061520.php
- https://phys.org/news/2020-06-black-female-principal-candidates-denied.html
- https://www.discovermagazine.com/health/stomachache-your-gut-bacteria-might-be-to-blame


## Install

`yarn install`

## Run

To run both the development environment and to build the extension requires seperate secret files in order to access the API. Please reach out to us at [support@considdr.com](mailto:support@considdr.com) in order to get set up.

To run the extension in development mode, run:

`yarn run dev`

To build the extension, run:

`yarn run build`