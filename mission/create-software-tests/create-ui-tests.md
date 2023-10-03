# Run UI Tests

## Introduction

Another set of tests that can be executed are the UI tests, where the application's interface is assessed on the basis of performance and functionality. The main objective would be to test the features that a user would interact with. This is done by mimicing the user actions and automating them on the browser with help of some automation framweork. These tests would ensure optimal user experience by minimizing glitches and slow load times and validate whether the desired functionalities can be carried out.

**Persona:** BTP Developer

### Prequisites:
1. Nodejs environment
2. Running UI5 application
3. Chrome browser 

### An introduction to the Webdriver.IO (WDIO) framework

For this mission the [Webdriver.IO framework](https://webdriver.io/), also known as WDIO, is used to perform the browser automation. It is rooted in node.js and is built on top of the selenium webdriver API using javascript. This means that node.js functions as the runtime environment, responsible for executing the test scripts. 
The framework is designed to automate not only web applications but mobile and native desktop apps as well. Webdriver.IO offers features such as :
    - **Cross-browser testing** : Supports applications to be tested across multiple browsers
    - **Built-in logging and reporting** : Provides an effective manner to comprehend test outcomes in the form of detailed reports
    - **Compatibility with other frameworks and services** : Allows for seamless integration thus satisfying varied project requirements
    - **Protocol support** : Compatible with both the Webdriver and Devtools protocols which are supported by most modern browsers
    
The WDIO test runner **'@wdio/cli'**, allows users to configure their testing environment in a straight-forward manner with the help of just a few commands. If you would like to try writing your own tests, [this would be the place to start](https://v7.webdriver.io/docs/gettingstarted/). This setup would do the following:
- Creates a **wdio.conf.js** file which holds all of the necessary environment configuration details
- Adds certain dependencies to your **package.json** file and installs them as well. A few of the main dependencies used for this mission are listed below:
    - @wdio/mocha-framework : an adapter package allowing us to make use of the mocha framework
    - @wdio/spec-reporter : generates reports in spec style
    - wdio-chromedriver-service : to run tests on the chrome browser
    - chromedriver : to create browser sessions
    - wdio-ui5-service : allows the usage of wdi5, the ui5 plugin for Webdriver.IO
- Adds a script to the package.json file to excute the scripts

### The wdi5 service

The [wdi5 service](https://ui5-community.github.io/wdi5/#/) is available as a part of the Webdriver.IO framework. It is built on top of the UI5 test API and bridges the gap between WDIO and the UI5 framework by being more aware of UI5 contols. As a result better synchronisation between the two frameworks is achieved. SAP BTP's Business Application Studio also extends wdi5 support through the Headless Testing Framework. Adding this framework to your space downloads the firefox browser thus allowing you to execute browser based tests.
![headless-testing-framework](./images/ui-test-1.png)

With wdi5, users can test both traditional UI5 and fiori applications. For the purpose of testing fiori apps, the service is integrated with the [OData V4 Test Library](https://sapui5.hana.ondemand.com/#/api/sap.fe.test), making it convenient to write the test scripts. This test library was originally used for running OPA5 based tests but now is extended for wdi5 usage as well. The library has a set of 'Actions' and 'Assertions' defined for different Fiori templates using which the browser can be controlled. This minimizes the need to explicitly define the controls and views of a page making the test scripts more UI5 friendly.

**NOTE : For this mission we are making use of wdi5^1.5.0 and thus will be using wdio^7**


### Understand the Test Cases

Now lets understand the testing configuration and the structure of tests in brief.

1. As mentioned above, [wdio.conf.js](../../app/BusinessPartners/wdio.conf.js) file has all details about the environment, namely:
    - the browser configuration in **Capabilities**
    - services/frameworks used in **Services** and **Framework**
    (note here the usage of the ui5 service, meaning wdi5)
    - path of the test files in **Specs**
    - the url of app to be tested in **BaseUrl**

2. In the [list.spec.js](../../tests/ui/specs/list.spec.js) file, we include the fiori page configurations which are required for making use of the testing library
![config](./images/ui-test-2.png)

3. In order to test the working of the application entirely, we begin by creating our test data. In this case this means creating mock business partners. Since this is only a testing environment, we will not be using actual S4 systems but rather a 'mock-server', which is essentially a CAP application that will enable us to create entities and emit events. This is mentioned as a **Git Submodule** in this repository as can be seen in the .gitmodules file. The test data is created using axios calls to this mock server ![mockserver](../../tests/ui/services/bpApi.js). 

4. Following this the application page functionalities are validated. This is done by making use of the library functions mentioned above:
![fioriFunctions](./images/ui-test-3.png).
As shown in the image, the tests are written in the form of **When** and **Then** statements which will execute an respectiveley execute and Action and Assertion (like mentioned aboved). 

5. Finally we end with deleting the test data from both the application and mock server.


### Run UI Tests in Your Terminal

NOTE: Ensure you the chrome browser installed on your system and you have the repository cloned as well.

1. First we need to fetch the mockserver submodule. Open your terminal, navigate to the root folder and run :
```
    git submodule init
    git submodule update
```

Ensure the mock-srv folder is not empty and has this structure.
![mockfolder](./images/ui-test-5.png)

2. Now open the package.json file in the root folder and **change the destination** to **from bupa to bupa-s4-test**.
![mockDestination](./images/ui-test-6.png)

3. Now you need to deploy both the application and mock server. For this you need to make use of the mta_withMock.yaml file which has the **mock-srv** module defined to deploy the mock server. So first change the current file **mta.yaml to mta_withoutMock.yaml** and change **mta_withMock.yaml to mta.yaml**. You file structure should now look like:
![mtaFileName](./images/ui-test-4.png).

4. Open the newly changed mta.yaml file and change **instance** to **subaccount** in the **module BusinessPartnerValidation-launchpad** and **resource BusinessPartnerValidation-dest**.
![mtaDest](./images/ui-test-10.png)
This is to ensure your deployed application does not have a guid in the url.

5. Now open your terminal login to any subaccount and space of your choice :
```
    cf api <API-ENDPOINT>
    cf login -u <USER-ID> -p <PASSWORD>
    cf target -o <ORG> -s <SPACE>
```

6. Deploy your application as :
```
   mbt build -p=cf
   cf deploy mta_archives/BusinessPartnerValidation_1.0.0.mtar
```

6. In the root folder, create a **.env** file. In this file you need to define the urls needed as evironment variables. For this you will need both the org and space name. In your terminal execute:
```
    cf target
```
This will print the the necessary details as the following:
![cf](./images/ui-test-11.png)

Make note of the api endpoint, org and space name. 

***NOTE :***
    **For the variables definition below ensure the following:**
    **- to replace any '_'(underscore) in the org or space name with a '-'(hyphen)**
    **- all upper case alphabets in the org and space name must be mentioned as lower case**
    **- only include the portion of the endpoint after 'cf'**

***For example if your org name is ABC_Org-name, space name is SPACE_NAME and endpoint is https://api.cf.end.point.com you must mention them as abc-org-name, space-name and end.point.com***

Environment variables need to be defined in the below form in the .env file.
```
    variableName=value
```

In this manner define the following:
- mockUrl : https://{orgName}-{spaceName}-mock-srv.cfapps.{endPoint}/odata/v4/
- mockApi : api-business-partner/A_BusinessPartner

**For the below two urls for the org name, **do not include** the portion before the '_'(underscore).  i.e., mention if your org name is ABC_Org-name, include it as org-name only**.
- appAuth : https://{orgName}.authentication.{endPoint}/login
- appUrl : https://{orgName}.launchpad.cfapps.{endPoint}/comsapbpBusinessPartnersone.comsapbpBusinessPartners-1.0.1/index.html

This is what your .env file should look like:
![envFile](./images/ui-test-12.png)

7. Now in your terminal run this command to navigate to the folder from where we need to trigger the tests:
```
    cd app/BusinessPartners
```
You will need to find out the current version browser of your chrome browser. For this open your chrome browser and navigate to about 'Google Chrome' from settings and check the version.
![browser](./images/ui-test-13.png)
For example according to this image, the browser version is 117.

Open the package.json file in app/BusinessPartners and modify the chromedriver dependency version to the value of your chrome browser. In this case it should be "chromedriver" : "117".

After this install the dependenices as :
```
    npm i
```

8. Now its time to run your tests. First lets run it normally i.e., in non-headless mode. For this open the wdio.conf.js file in app/BusinessPartners and comment out (use ctrl+C) the following portions under **Capabilities** as shown below.
![nonHeadless](./images/ui-test-14.png)

9. Next in your terminal run:
```
    npm run wdi5
```
You should see a browser pop up and it behaving in an automated manner. 


You should also see logs being printed on your terminal.


Once the excution is done, you should be able to see a report of the tests.


10. To execute the tests in a headless manner, we first need to mention your subaccount's username and password in your .env file. Add them in the following manner:
- wdi5_username={username}
- wdi5_password={password}
 It should look like the following:
 ![envUser](./images/ui-test-15.png)

 11. Now go back to the wdio.conf.js file and uncomment the portion commented above. Tests can be executed in the same manner again. Note that headless mode means the test execution will not be visible i.e., a browser window will not pop up. 
 ```
    npm run wdi5
 ```
 You can keep tracks of the tests through the logs and finally the test report generated the same as above.

