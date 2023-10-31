# Run UI Tests

## Introduction

Another set of tests that can be executed are the UI tests, where the application's interface is assessed on the basis of performance and functionality. The main objective is to test the features with which a user would interact. This is achieved by automating user actions within the browser using an automation framework. These tests are essential to guarantee an optimal user experience by reducing glitches and minimizing slow load times. They also verify whether the desired functionalities can be executed as intended.

<br>

**Persona:** BTP Developer

### Prequisites:
1. Nodejs environment
2. Running UI5 application
3. Chrome browser 

<br>

## An Introduction to the Webdriver.IO (WDIO) Framework

In this mission, we utilize the [Webdriver.IO framework](https://webdriver.io/), commonly referred to as WDIO, to automate browser actions. Rooted in node.js and built on top of the selenium webdriver API using JavaScript, this framework operates within the node.js runtime environment, enabling the execution of test scripts. 
The framework is designed to automate not only web applications but mobile and native desktop apps as well. Webdriver.IO offers features such as:
- **Cross-browser testing**: Supports applications to be tested across multiple browsers
- **Built-in logging and reporting**: Provides an effective manner to comprehend test outcomes in the form of detailed reports
- **Compatibility with other frameworks and services**: Allows for seamless integration thus satisfying varied project requirements
- **Protocol support**: Compatible with both the Webdriver and Devtools protocols which are supported by most modern browsers
    
The WDIO test runner **'@wdio/cli'**, allows users to configure their testing environment in a straight-forward manner with the help of just a few commands. This setup would do the following:
- Creates a **wdio.conf.js** file which holds all of the necessary environment configuration details
- Adds certain dependencies to your **package.json** file and installs them as well
- Adds a script to the package.json file to excute the scripts

<br>

## The wdi5 Service

The [wdi5 service](https://ui5-community.github.io/wdi5/#/) is available as a part of the Webdriver.IO framework. It is built on top of the UI5 test API and bridges the gap between WDIO and the UI5 framework by being more aware of UI5 contols and viewa. As a result better synchronization is achieved between the two frameworks. SAP BTP's Business Application Studio also extends wdi5 support through the Headless Testing Framework. Adding this framework to your space downloads the firefox browser thus allowing you to execute browser based tests.
![headless-testing-framework](./images/ui-test-1.png)

With wdi5, users can test both traditional UI5 and fiori applications. For the purpose of testing fiori apps, the service is integrated with the [OData V4 Test Library](https://sapui5.hana.ondemand.com/#/api/sap.fe.test), making it convenient to write the test scripts. This test library was originally used for running OPA5 based tests but now is extended for wdi5 usage as well. 

The library has a set of 'Actions' and 'Assertions' defined for different Fiori templates using which the browser can be controlled. This minimizes the need to explicitly define the controls and views of a page making the test scripts more UI5 friendly.

<br>

## Environment Configuration

As mentioned above, all the relevant configuration details are added in the `wdio.conf.js` file located within the `app/BusinessPartners` directory.

In the same folder, the package.json file contains the necessary dependencies that support the mentioned configurations. The entire setup was accomplished using the WDIO test runner's @wdio/cli.

For this mission, below is the set up:

| Configuration in the wdio.conf.js file        | Corresponding package.json dependency         | Brief Explanation         |
| :-------------------------------------------  |:-------------                                 | :-----                    |
| **Capabilities** : Chrome browser         | wdio-chromedriver-service                                  | Enables the test scripts to communicate with the browser thus allowing the tests to be executed on chrome |
| **Framework** : Mocha          | @wdio/mocha-framework                         | Allows users to write tests using the framework, the dependency acts like an adapter package  |
| **Reporters** : Spec             | @wdio/spec-reporter                           | To generate reports in spec style |
| **Services** : UI5               | wdio-ui5-service                              | Allows the usage of wdi5 |

Other details mentioned in the configuration file includes : the path of the test files, browser timeouts, protocol to be used, hooks to be executed etc.

If you're interested in writing your own tests, [this link](https://v7.webdriver.io/docs/gettingstarted/) is a great starting point. You can follow the steps provided there to set up your testing environment.

<br>

## Understand the Test Cases

Now lets understand the structure of the tests in brief.

1.  The `test.spec.js` file insider `tests/ui/specs`, includes:
    - the fiori page configurations which are required for making use of the testing library (The details required for this can be found in the manifest.json file inside app/BusinessPartners)


        ![config](./images/ui-test-2.png)

    - the test suites, which are essentially the family of tests to be executed
    
2. In order to test the working of the application entirely, the testing begins with creating **test data**. In this case this means creating **mock business partners**. 

    ince this is a test environment, actual SAP S/4HANA system will not be used but rather a 'mock-server', which is a CAP application that will enable us to create Business Partner data and emit events. 
    
    This is referenced as a **Git Submodule** within this repository, as indicated in the **`.gitmodules`** file located in the root folder. The test data is generated through axios calls made to this mock server (you can find these calls in the `tests/ui/services/bpApi.js` file). 

3. Following this the application page functionalities are validated. This is done by making use of the library functions mentioned above:

    ![fioriFunctions](./images/ui-test-3.png)

    As shown in the image, the tests are written in the form of **When** and **Then** statements which will respectively execute the Actions and Assertions(like mentioned aboved). 
    
    For instance, in the above example :
    - Then statement : check if the main page has loaded and is visible. This is an assertion
    - When statement : display all rows of a table using the Search button of the Filter Bar. This is an **Action**.
    - Then statement : check if a particular entry/row is visible in this table. This is also an **Assertion**.
    
    <br>
    For each When/Then statement the corresponding fiori page is required. The appropriate functions to be used with each template can be found in the [Test Library](https://sapui5.hana.ondemand.com/#/api/sap.fe.test) under the **List Report** and **Object** pages. 
    
    <br>
    Each template has its own set of actions and assertions which may require certain parameters to identify controls/views. These parameters can be found by inspecting your webpage.
<br>

4. Finally the testing ends with deleting the test data from both the application and mock server.

<br>

## Run UI Tests in Your Terminal
<br>

    NOTE: Ensure you have the chrome browser installed on your system and you have the mission repository cloned as well.
<br>

1. First you need to fetch the mockserver submodule. Open your terminal, navigate to the root folder and run :
    ```
        git submodule init
        git submodule update
    ```
    Ensure the mock-srv folder is not empty and has this structure.

    ![mockfolder](./images/ui-test-4.png)

2. Now you need to deploy both the application and mock server. For this you need to make use of the `tests/ui/mta.yaml` file. This file is a bit different from the `mta.yaml` file in the root because of the following mentioned:
    - **mock-srv** module defined to deploy the mock server [Check modules]
    - **bupa** destination to make use of the deployed mock server [Check resource BusinessPartnerValidation-dest]
    - all destinations being created at the **subaccount** level instead of the instance level, to prevent the deployed application from having a guid in its url [Check resource BusinessPartnerValidation-dest and module BusinessPartnerValidation-launchpad]

    So first change the name of the current file **mta.yaml to mta_Prod.yaml** and move the **tests/ui/mta.yaml** file to the root. You file structure should now look like:

    ![mtaFileName](./images/ui-test-6.png)

3. Now open your terminal login to any subaccount and space of your choice :
    ```
    cf api <API-ENDPOINT>
    cf login -u <USER-ID> -p <PASSWORD>
    cf target -o <ORG> -s <SPACE>
    ```

4. Deploy your application as :
    ```
    mbt build 
    cf deploy mta_archives/BusinessPartnerValidation_1.0.0.mtar
    ```

5. In the root folder, create a **.env** file. In this file you need to define some of the urls needed as evironment variables. For this you will need both the org and space name. In your terminal execute:
    ```
    cf target
    ```
    This will print the the necessary details as the following:
    ![cf](./images/ui-test-11.png)

    Make note of the <u>api endpoint</u>, <u>org</u> and <u>space name</u>. 

<br>

    NOTE :
        For the variables definition below ensure the following:
        - to replace any '_'(underscore) in the org or space name with a '-'(hyphen)
        - all upper case alphabets in the org and space name must be mentioned as lower case
        - for the endpoints, only include the portion after 'cf'

    For example if your org name is ABC_Org-name, space name is SPACE_NAME and endpoint is https://api.cf.end.point.com you must mention them as abc-org-name, space-name and end.point.com
<br>


Environment variables need to be defined in the below form in the .env file.
```
variableName=value
```

In this manner define the following:
- mockUrl : https://{orgName}-{spaceName}-mock-srv.cfapps.{endPoint}/odata/v4/api-business-partner/A_BusinessPartner

        NOTE:
        For the below url for the org name, do not include the portion before the  '_'(underscore).  i.e., if your org name is ABC_Org-name, include it as org-name only

- appAuth : https://{orgName}.authentication.{endPoint}/login

<br>

You would also need to mention your subaccount's username and password in your .env file if:
- you do not have SSO enabled in your browser
- you are running your tests in headless mode ie., no browser window would pop up

Add them in the following manner:
- wdi5_username={username}
- wdi5_password={password}

<br>

This is what your .env file should look like:

![envFile](./images/ui-test-12.png)

<br>

6. Now in your terminal run this command to navigate to the folder from where you will need to trigger the tests:
    ```
    cd app/BusinessPartners
    ```

    After this install the dependenices as :
    ```
    npm i
    ```

7. Now its time to run your tests. First lets run it normally i.e., in **non-headless mode**. For this open the wdio.conf.js file in app/BusinessPartners and comment out (using ctrl+C) the following portions under **Capabilities** as shown below.
![nonHeadless](./images/ui-test-14.png)

    If you do not have SSO enabled in your browser, leave the **wdi5:authentication** portion uncommented.

8. To run the tests you need to pass the url of the application with the command. The way the url needs to be defined is mentioned below. In your terminal run:
    ```
        npm run wdi5 -- --baseUrl:https//{orgName}.launchpad.cfapps.{endPoint}/comsapbpBusinessPartnersone.comsapbpBusinessPartners-1.0.1/index.html#Shell-home
    ```
    You should see a browser pop up and behave in an automated manner. 

    ![browserPopUp](./images/ui-test-16.png)


    You should also see logs being printed on your terminal.

    ![logs](./images/ui-test-17.png)


    Once the excution is done, you should be able to see a report of the tests.

    ![report](./images/ui-test-18.png)


9. To execute the tests in a headless manner, ensure you have mentioned your subaccount credentials in the .env file (explained in step 5)

10. Now go back to the wdio.conf.js file and uncomment the portion commented above (in step 7). Tests can be executed in the same manner again. 

    Note that headless mode means the test execution will not be visible i.e., a browser window will not pop up. 

    You can keep tracks of the tests through the logs and finally the test report generated the same as above.

11. Now you can go back and undeploy your application using the cf undeploy command. You can this command in your terminal : 
    ```
    cf undeploy BusinessPartnerValidation --delete-services --delete-service-keys
    ```

    Please ensure to manually delete the destinations **ui5** and **bupa** from the **Destinations** section of the BTP Cockpit as it would not be removed with the above command stage due it being a subaccount level destination.

    ![test](../setup-cicd-ui/images/ci-cd-7.png)


