# Develop Demo Application with Mock SAP S/4HANA Service

## Introduction
You will now develop a CAP application using Visual Studio Code. 
**Persona:** BTP Developer

### Set Up Node

1.	Open link to [download node](https://nodejs.org/en/)
2.	Choose and download the recommended version for most users
3.	Follow the instructions to install node
> Hint: If you are using a Mac its recommended to install node via Homebrew using command 'brew install node.' 

### Prepare Your Local Development Environment

1.	Open Visual Studio Code	
2.	Click on **Terminal** and choose **New Terminal** in the dropdown menu
	
   ![New Terminal](././images/develop-application-1a.png)

3.	Install [CDS](https://cap.cloud.sap/docs/cds/) with the command: 

```
npm i -g @sap/cds-dk
```

4.	Initialize CDS 
```
cds init BpValidationMockS4
```

### Develop Application Against Mock API

1. In VS Code choose **File** and choose **Add Folder to Workspace** in the dropdown menu

      ![Add folder to Workspace](./images/develop-app-1.png)

2. Execute the command to import the API EDMX file
```
cds import API_BUSINESS_PARTNER.edmx
```

> Hint: make sure that the EDMX file is in your folder or provide the path to the EDMX file. This is the file you have downloaded from the API Business Hub in an earlier step. 

![Import Business Partners](./images/develop-app-2.png)

3. Navigate to the **srv/external** folder in the explorer and click right to open the dropdown and choose **New Folder**

![Create new Folder](./images/develop-app-3.png)

4. Name your created folder _data_

5. Now click right on your created data folder and choose **New File** in the dropdown

![Create new File](./images/develop-app-4.png)

6. Name your created file 'API_BUSINESS_PARTNER-A_BusinessPartnerAddress.csv'

7. Now open the file and copy the example address data into the empty file:

``` 
BusinessPartner,AddressID,StreetName,CityName,Country,postalCode 

"17100001","124462","Dietmar-Hopp-Allee 162","Walldorf","DE","12345" 

"17100005","124465","whitefield 162","Bangalore","IN","560066“

``` 

8. **Save** the file



 


