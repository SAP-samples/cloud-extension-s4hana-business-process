# Run UI Tests

## Introduction

Another set of tests that can be executed are UI tests, where the interface is assessed on the basis of performance and functionality. The main objective would be to test the features that a user would interact with. This is done by mimicing the user actions and automating them on the browser with help of some automation framweork. These tests would ensure optimal user experience by minimizing glitches and slow load times and validate whether the desired functionalities can be carried out.

**Persona:** BTP Developer

### Prequisites:

### An introduction to the Webdriverio (WDIO) framework

For this mission the webdriverio framework, also known as WDIO, is used to perform the browser automation. It is rooted in node.js and built on top of the selenium webdriver API using javascript. This means that node.js functions as the runtime environment responsible for executing the test scripts. It is designed to automate not only web applications but mobile and native desktop apps as well. Webdriverio offers features such as :
    - **Cross-browser testing** : Supports applications to be tested across multiple browsers
    - **Built-in logging and reporting** : Provides an effective manner to comprehend test outcomes in the form of detailed reports
    - **Compatibility with other frameworks and services** : Allows for seamless integration thus satisfying varied project requirements
    - **Protocol support** : Compatible with both the Webdriver and Devtools protocols which are supported by most modern browsers
    
The WDIO test runner **'@wdio/cli'**, allows users to configure their testing environment in a straight-forward manner with the help of just a few commands. If you would like to try writing your own tests, [this would be the place to start](https://v7.webdriver.io/docs/gettingstarted/). This setup would do the following:
- Creates a **wdio.conf.js** file which holds all of the necessary environment configuration details
- Adds certain dependencies to your **package.json** file and installs them as well
    - @wdio/mocha-framework : an adapter package allowing us to make use of the mocha framework
    - @wdio/spec-reporter : generates reports in spec style
    - wdio-chromedriver-service : to run tests on the chrome browser
    - chromedriver : to create browser sessions
    - wdio-ui5-service : allows the usage of wdi5, the ui5 plugin for webdriverio
- Adds a script to the package.json file to excute the scripts

### The wdi5 service

This service is available as a part of the webdriverio framework. It is built on top of the UI5 test API and bridges the gap between WDIO and UI5 framework by being more aware of UI5 contols. As a result better synchronisation between the two frameworks is achieved. SAP BTP's Business Application Studio also extends wdi5 support through the Headless Testing Framework. Adding this framework to your space downloads the firefox browser thus allowing you to execute browser based tests.
![headless-testing-framework](./images/ui-test-1.png)

With wdi5, users can test both traditional UI5 and fiori applications. For the purpose of testing fiori apps, the service is integrated with the [OData V4 Test Library](https://sapui5.hana.ondemand.com/#/api/sap.fe.test), making it convenient to write the test scripts. This test library was originally used for running OPA5 based tests but now is extended for wdi5 usage as well. The library has a set of 'Actions' and 'Assertions' defined for different Fiori templates using which the browser can be controlled. This minimizes the need to explicitly define the controls and views of a page making the test scripts more UI5 friendly.

NOTE : For this mission we are making use of wdi5^1.5.0 and thus will be using wdio^7


### Understand the Test Cases

Now lets understand the testing configuration and the structure of tests in brief.

1. As mentioned above, [wdio.conf.js](../../app/BusinessPartners/wdio.conf.js) file has all details about the environment, namely:
    - [the browser configuration](./images/ui-test-2.png)
    - services/frameworks used   
    - path of the spec files
    - 

### Run UI Tests in Your Application

1. Go back to your IDE

2. Open the terminal and run the following test script


```
npm run wdi5

```


!!! headless also
