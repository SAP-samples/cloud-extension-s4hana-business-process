

# Develop SAP Cloud Application Programming Model Application

## Introduction

In this how to guide, you will create a new CAP application in SAP Business Application Studio and test your application.

**Persona:** BTP Developer

### Create a New Application in SAP Business Application Studio

1.	Make sure you have opened your *SAP BTP Account* and navigate to your *Subaccount* 
   
2.	Open the menu *Services* and navigate to *Instances and Subscriptions*
   
3.	Choose "SAP Business Application Studio" under the *Subscriptions* tab and click on the icon to open the application
     
     ![Open SAP Business Application Studio](./images/dev-cap-app-1.png)
 
4.	 After opening the home sceen of SAP Business Application Studio, click the button *Create Dev Space*

     ![Create Dev Space](./images/dev-cap-app-3.png)
 
5.	On the next screen, you will create the new Dev Space. For this enter a Dev space name e.g 'BusinessProcess', select the type *Full Stack Cloud Application*.
    Don´t forget to click on the button *Create Dev Space*

      ![Configure Dev Space](./images/dev-cap-app-4.png)
      
 
6.	Your Dev Space is now being created. As soon as the Dev Space is running, you can click on your Dev Spaces name to access

7.	Choose *Terminal -> New Terminal* in the menu on the top of your screen.

    ![Open Terminal](./images/dev-cap-app-5.png)
 
8. In the opened terminal go to projects folder with executing
   
   ``` 
   cd projects
   ``` 
 
9.	 Then clone the project from your personal GitHub and enter username and token to execute the command: 
   ``` 
   git clone <YourPersonalGitHub>
   ``` 
 
10.	Click on *File* in the menu on the top and choose *Open Workspace* in the drop-down.

    ![Open Workspace](./images/dev-cap-app-7.png)
 
11.	 Open the project by selecting projects -> cloud-extension-s4hana-business-process and click on *Open*
 
12. For the next steps, you need the terminal again. Go to *Terminal* -> *New Terminal*
     
13. First you need to [login](https://help.sap.com/docs/BTP/65de2977205c403bbc107264b8eccf4b/7a37d66c2e7d401db4980db0cd74aa6b.html):
> You can find the API Endpoint of your Subaccount in the BTP Cockpit-Overview section
 
    
    cf api <api endpoint>
    cf login -u <user id> -p <password>
    cf target -o org -s space
 
         

14. Then you will get the guid of your SAP HANA Cloud. Please note that, in case that you do not have a SAP HANA Cloud in your SAP BTP environment yet, you will have to create one. You can either follow the steps below or follow the more detailed tutorial for creating a SAP HANA Cloud instance [at SAP Help Portal](https://help.sap.com/viewer/db19c7071e5f4101837e23f06e576495/2020_03_QRC/en-US/921f3e46247947779d69b8c85c9b9985.html).
 ```
  cf create-service hana-cloud hana my_hana_db -c '{"data":{"edition":"cloud","memory":30,"systempassword":"<password>"}}'
  cf service <HANA-cloud> --guid
 ```             
15. In a next step, using the guid of your HANA service, you will create an hana instance
  ```  
  cf create-service hana hdi-shared BusinessPartnerValidation-db -c '{"database_id" :"<guid of HANA cloud>"}'
  ``` 
16. Use "cds build" to build tasks on your project folders to prepare them for deployment.
  ```
  cds build --production
  ``` 
17. Install cf CLI plugin to create services specified from a services manifest.yml file 
  ```	
  cf install-plugin Create-Service-Push
  ``` 
18.  Go to gen/srv
    
    
20.  Now you will use manifest file to build services in your application. Modify manifest.yml as below:
 ```
---
applications:
# -----------------------------------------------------------------------------------
# Backend Service
# -----------------------------------------------------------------------------------
- name: BusinessPartnerValidation-srv
  random-route: true  # for development only
  path: gen/srv
  memory: 256M
  buildpack: nodejs_buildpack
  services:
  - BusinessPartnerValidation-db
  - BusinessPartnerValidation-xsuaa
  - BusinessPartnerValidation-ems
  - BusinessPartnerValidation-dest
  - BusinessPartnerValidation-cs

# -----------------------------------------------------------------------------------
# HANA Database Content Deployer App
# -----------------------------------------------------------------------------------
- name: BusinessPartnerValidation-db-deployer
  path: gen/db
  no-route: true
  health-check-type: process
  memory: 256M
  instances: 1
  buildpack: nodejs_buildpack
  services:
  - BusinessPartnerValidation-db

```

21. Also, modify services-manifest.yml as below:

```
---
create-services:
# ------------------------------------------------------------
  - name:   BusinessPartnerValidation-db
    broker: hana  # 'hanatrial' on trial landscapes
    plan: "hdi-shared"
# ------------------------------------------------------------
  - name:   BusinessPartnerValidation-xsuaa
    broker: xsuaa
    plan: application
    parameters: "./xs-security.json"
# ------------------------------------------------------------
  - name:   BusinessPartnerValidation-ems
    broker: enterprise-messaging
    plan: default
    parameters: "./em.json"
# ------------------------------------------------------------
  - name:   BusinessPartnerValidation-dest
    broker: destination
    plan: lite
# ------------------------------------------------------------
  - name:   BusinessPartnerValidation-cs
    broker: connectivity
    plan: lite

```

 22. Now use the installed plugin to create services
```
  cf create-service-push
```
 23. Use terminal to create service key
 ```
  cf create-service-key BusinessPartnerValidation-ems emkey
```   
               
> HINT: there is an additional way of deployment - either execute the steps before or the two below to achieve the same result: Run *mbt build -p=cf* followed by cf *deploy mta_archives/BusinessPartnerValidation_1.0.0.mtar*

24. Go back to project directory using command
```
  cd ..
```
 
25.	Run following commands:

   ```
    cf p -f gen/db
    cf p -f gen/srv --random-route
   ```
 
26. The MTA deployment is described in the MTA Deployment Descriptor, a file called mta.yaml. As the first step, you let the CAP server generate an initial mta.yaml file.

     ```
     cds add mta
     ```
> Hint: This step only needs to be executed in case you have created a new project. As we are using an existing project in this tutorial, you can skip this step as the mta file is already added
<a name="launchpad"></a>
	
	
### Test Your Application

Deploy the application to the SAP Launchpad Service
1. Go back to your SAP BTP Account
2. Go to *Instances and Subscriptions*
3. Find *Launchpad Service* and click to open the application
4. In the Website Manager find your created Website and click on tile to open






