# SAP S/4HANA Extended Business Process Scenario
[![REUSE status](https://api.reuse.software/badge/github.com/SAP-samples/cloud-extension-s4hana-business-process)](https://api.reuse.software/info/github.com/SAP-samples/cloud-extension-s4hana-business-process)
## Description
The main intent of this scenario is to complement an existing business process in an SAP solution – currently SAP S/4HANA with additional business process steps. This involves adding major logic and/or additional data and goes beyond simple UI changes.

This application showcases:

- Building applications on SAP Business Technology Platform (BTP) using [SAP Cloud Application Programming Model(CAP)](https://cap.cloud.sap/docs/)
- Consuming events from SAP S/4HANA on premise using [SAP Event Mesh](https://help.sap.com/viewer/bf82e6b26456494cbdd197057c09979f/Cloud/en-US/df532e8735eb4322b00bfc7e42f84e8d.html)
- Consuming REST APIs from SAP S/4HANA on premise using SAP Business Technology Platform Connectivity Service


## Business Scenario

A business scenario is used to showcase how to build a S/4 HANA on premise extension Application on SAP BTP.

John who is an employee of Business Partner Validation Firm iCredible, which is a third-party vendor of ACME Corporation would like to get notifications whenever new Business Partners are added in the S/4HANA backend system of ACME Corporation. John would then be able to review the Business Partner details in his extension app. He would proceed to visit the Business Partner’s registered office and do some background verification. John would then proceed to update/validate the verification details into the extension app. Once the details are verified, the Business Partner gets activated in the S/4HANA system of ACME Corporation.

- Custom extension application that works independently from S/4HANA.

- Changes in S/4 communicated via events in real time to extension application.

- Vendor personnel needs access to only custom app

## Architecture

### Solution Diagram

![solution diagram](./documentation/images/solution-diagram.jpg)

The Business Partner Validation application is developed using the SAP Cloud Application programming Model (CAP) and runs on the SAP BTP,  Cloud Foundry runtime. It consumes platform services like SAP Event Mesh, SAP HANA and Connectivity. The events occuring in S/4 HANA on premise are inserted into the Event Mesh queue. The application running in Cloud Foundry is notified on events, consumes them from the queue and inserts the event data into the HANA database. The Business Partner Validation Application uses S/4 HANA REST API's to read additional Business Partner Data from the S/4 HANA system. 

## Requirements
* SAP S/4HANA on premise system.
* SAP BTP account

### For local development you would require the following:
* [Node js](https://nodejs.org/en/download/)
* [Cloud Foundry Command Line Interface (CLI)](https://github.com/cloudfoundry/cli#downloads)
* [Visual Studio Code](https://cap.cloud.sap/docs/get-started/in-vscode)
* [cds-dk](https://cap.cloud.sap/docs/get-started/)
* [SQLite ](https://sqlite.org/download.html)
* To build the multi target application, we need the [Cloud MTA Build tool](https://sap.github.io/cloud-mta-build-tool/), download the tool from [here](https://sap.github.io/cloud-mta-build-tool/download/)
* For Windows system, install 'MAKE' from https://sap.github.io/cloud-mta-build-tool/makefile/
* [multiapps plugin](https://github.com/cloudfoundry-incubator/multiapps-cli-plugin) - `cf install-plugin multiapps`  
*  mbt -  `npm install -g mbt`

### Entitlements

The application requires below set of SAP Cloud Platform Entitlements/Quota

| Service                           | Plan       | Number of Instances |
|-----------------------------------|------------|:-------------------:|
| Event Mesh                        | default    |          1          |
| SAP HANA Schemas & HDI Containers | hdi-shared |          1          |
| SAP HANA Cloud           | 64standard |          1          |
| Application Runtime               |            |          1          |
| Extension Factory Runtime         |            |          1          |
| SAP Build Work Zone, standard edition |standard    |          1          |

## Configuration


### Step 1: [Identify API in API Business Hub](https://github.com/SAP-samples/cloud-extension-s4hana-business-process/blob/mission/mission/develop-application/IdentifyAPIFromAPIBusinessHub.md)

### Step 2: [Prepare the local development environment](https://github.com/SAP-samples/cloud-extension-s4hana-business-process/blob/mission/mission/develop-application/Jumpstart%20Dev%20Environment.md)
### Step 3: [Use Visual Studio to create a nutshell application using an SAP S/4HANA mock service ](https://github.com/SAP-samples/cloud-extension-s4hana-business-process/blob/mission/mission/develop-application/README.md)
### Step 4: [Test your application against the SAP S/4HANA Mock Service](https://github.com/SAP-samples/cloud-extension-s4hana-business-process/blob/mission/mission/develop-application/testmockapplication.md)

### Step 5: [Configure OData Service in S/4HANA System](https://github.com/SAP-samples/cloud-extension-s4hana-business-process/blob/mission/mission/configure-oData-Service/README.md)
### Step 6: [Configure BTP Environment](https://github.com/SAP-samples/cloud-extension-s4hana-business-process/blob/mission/mission/Prepare-Cloud-Platform/Booster.md)
### Step 7: [Configure Event Based Communication between S/4HANA and Event Mesh](https://github.com/SAP-samples/cloud-extension-s4hana-business-process/blob/mission/mission/event_based/README.md)
### Step 8: [Configure Business Application Studio and develop Cloud Application Programming Model application](https://github.com/SAP-samples/cloud-extension-s4hana-business-process/blob/mission/mission/develop-cap-app/README.md)
### Step 9: [Connect S/4HANA system using Cloud Connector](https://github.com/SAP-samples/cloud-extension-s4hana-business-process/blob/mission/mission/cloud-connector/README.md)
### Step 10: [Test scenario](https://github.com/SAP-samples/cloud-extension-s4hana-business-process/blob/mission/mission/testbasicscenario/README.md)




## Known Issues

No known issues.

## How to Obtain Support

In case you find a bug, or you need additional support, please [open an issue](https://github.com/SAP-samples/cloud-extension-s4hana-business-process/issues/new) here in GitHub.

## License
Copyright (c) 2020 SAP SE or an SAP affiliate company. All rights reserved. This file is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](LICENSES/Apache-2.0.txt) file.

