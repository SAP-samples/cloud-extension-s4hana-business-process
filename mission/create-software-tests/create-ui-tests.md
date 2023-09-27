# Run UI Tests

## Introduction

Another set of tests that can be executed are UI tests, where the interface is assessed on the basis of performance and functionality. The main objective would be to test the features that a user would interact with. This is done by mimicing the user actions and automating them on the browser with help of some automation framweork. These tests would ensure optimal user experience by minimizing glitches and slow load times and validate whether the desired functionalities can be carried out.

**Persona:** BTP Developer

### Prequisites:

### An introduction to the webdriverio framework

For this mission the webdriverio framework is used to perform the browser automation. It is rooted in node.js and built on top of the selenium webdriver API using javascript. This means that node.js functions as the runtime environment responsible for executing the test scripts. It is designed to automate not only web applications but mobile and native desktop apps as well. Webdriverio offers features such as :
    - **Cross-browser testing** : Supports applications to be tested across multiple browsers
    - **Built-in logging and reporting** : Provides an effective manner to comprehend test outcomes in the form of detailed reports
    - **Compatibility with other frameworks and services** : Allows for seamless integration thus satisfying varied project requirements
    - **Protocol support** : Compatible with both the Webdriver and Devtools protocols which are supported by most modern browsers
    
The webdriverio test runner **'@wdio/cli'**, allows users to configure their testing environment in a straight-forward manner with the help of just a few commands. If you would like to try writing your own tests, [this would be the place to start](https://v7.webdriver.io/docs/gettingstarted/). This setup would do the following:
- Creates a **wdio.conf.js** file which holds all of the necessary environment configuration details namely:
    - the browser being used
    - the path of the specs file
    - additional services/framework used
    - hooks to be executed at certain parts of the script 
- Adds certain dependencies to your **package.json** file and installs them as well. For our UI tests we mainly make use of:
    - @wdio/mocha-framework : an adapter package allowing us to make use of the mocha framework
    - @wdio/spec-reporter : generates reports in spec style
    - wdio-chromedriver-service : to run tests on the chrome browser
    - wdio-ui5-service : allows the usage of wdi5, the ui5 plugin for webdriverio
- Adds a script to the package.json file to excute the scripts

### The wdi5 service

This service is available as a part of the webdriverio framework. It is built on top if the UI5 test API and bridges the gap between the webdriverio and UI5 frameworks. With wdi5, users can now test both traditional UI5 and fiori applications. For the purpose of testing fiori apps, the service is integrated with the OData V4 Test Library, making it more convenient to write the test scripts. 

### Understand the Test Cases

!!! Brief about mock bp creation, mock server setup

1. The repository already has ui tests written and ready to b eexecuted [GitHub](https://github.com/SAP-samples/cloud-extension-s4hana-business-process/blob/main/tests/integration/BPValidation.test.js). In case you have not cloned the repository in an earlier step, copy the files to your created repository.

2. Ensure the application is running locally using cds watch

3. Add the url to the wdio.confjs file

4. Navigate to the app/BusinessPartners folder and do an npm install

### Run UI Tests in Your Application

1. Go back to your IDE

2. Open the terminal and run the following test script


```
npm run wdi5

```


!!! headless also
