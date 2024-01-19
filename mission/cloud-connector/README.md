# Configure Systems in Cloud Connector 

## Introduction

In this section, you will configure the Cloud Connector for connecting the on-premise back end system to the SAP Business Technology Platform. 

**Persona:** BTP Admin


### Configure Systems in Cloud Connector for Access with Technical User

1.	Open your Cloud Connector administration UI for the SAP S/4HANA on-premise system.

    Go to https://localhost:8443/   
    
    Hint: adjust the port if you specified another one during the installation. Potentially you might have to use the external IP of your system. 

    Enter User Name and Password.
    Click Login.

    You can find detail information on installing the Cloud Connector in your system landscape here: 
    https://help.sap.com/docs/connectivity/sap-btp-connectivity-cf/installation

2.	Choose *Add Subaccount* and then fill out the needed input:
3.	Enter the following data:
    - Region
    - Subaccount ID
    - Display Name
    - Subaccount User
    - Password
    - Then click the *Save* button
    
    ![Add Subaccount](./images/cloud-connector-1.png)
    
    You can look up the required data in the SAP BTP Cockpit.
    
4.	Navigate to *Cloud to On-Premise* 
5.	To add a new system-mapping click on the *'+'* on the right site of the screen

 ![System Mapping](./images/cloud-connector-2.png)
 
6.	In the pop-up window select 'ABAP System' as a *Backend Type* and then choose *Next*

 ![Select Backend Type](./images/cloud-connector-3.png)
 
7.	Select 'HTTPS' as a *Protocol* and then choose *Next*

![Select Protocol](./images/cloud-connector-4.png)

8.	Enter your values for the fields: *Internal Host* and *Internal Port* then choose *Next*

![Select Screen](./images/cloud-connector-5.png)

9. Enter your values for the fields: *Virtual Host* and *Virtual Port* then choose Next

10.	Choose *Principal Type* 'None' and press *Next*

11.	Select *Host in header* 'Use Virtual Host' and choose *Next*

![Select Host](./images/cloud-connector-6.png)

12.	Add a *Description* for your system mapping

![Add Description](./images/cloud-connector-7.png)

13.	Make sure all the values are correct in the summary and don´t forget to check the Internal Host checkmark.
14.	Choose *Finish*

![Check values](./images/cloud-connector-8.png)

15.	Click on Button *'+'* to Add resource

 ![Button](./images/cloud-connector-9.png)
 
16.	Enter the following data:
    - URL Path: "/"
    - Check *Path and all sub-paths*
    - Description
    
![Enter data](./images/cloud-connector-10.png)

### Create Cloud Foundry Destination

1.	Open your *SAP BTP Account* and navigate to your *Subaccount*
2.	Choose *Connectivity* in the menu on the left then choose *Cloud Connectors* to check the host details

![Check host detail.](./images/cloud-connector-11.png)

3.	Go back to Connectivity in the menu on the left then choose *Destinations -> New Destination*

4.	Enter the following information to the Destination Configuration:
    - *Name:* bupa
    - *Url:* insert url of the on-premise system (`http://<virtual host>:<virtual port>/sap/opu/odata/sap/API_BUSINESS_PARTNER`)
    - Change *Proxy Type* to 'OnPremise'
    - Select *Authentication:* 'Basic Authentication'
    - Add location Id (In case of multiple CC)
    -Basic Authentication with User and Password
5.	Click on *Save* (optionally you can also *check the connection*) and close the window

![Configure Destination](./images/cloud-connector-13.png)

6. Repeat the step to create a new Destination: 
    - *Name:* odataprov
    - *Url:* insert url of the on-premise system (`http://<virtual host>:<virtual port>/sap/iwbep?sap-client=100`)
    - Change *Proxy Type* to 'OnPremise'
    - Select *Authentication:* 'Basic Authentication'
    - Add location Id (In case of multiple CC)
    -Basic Authentication with User and Password
7.  Click on *New Property* and enter KEY 'odc' and Value 'true'

8.	Click on *Save* (optionally you can also *check the connection*) and close the window!

