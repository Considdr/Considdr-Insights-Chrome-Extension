# Considdr Insights

A Chrome extension that highlights the key insights in documents across the web.

<img src="considdr-insights.gif">

This extension interfaces with Considdr's Insights API (built in tandem with this project) to retrieve insights for a specific page. This is a REST API built using AWS Lambda and AWS API Gateway.

This extension requires a Considdr account in order to log in and highlight insights. Please reach out to us at [support@considdr.com](mailto:support@considdr.com) to get demo access to the extension.

**This extension is pending approval in the Chrome Web Store**

## Install

`yarn install`

## Run

To run both the development environment and to build the extension requires seperate secret files in order to access the API. Please reach out to us at [support@considdr.com](mailto:support@considdr.com) in order to get set up.

To run the extension in development mode, run:

`yarn run dev`

To build the extension, run:

`yarn run build`