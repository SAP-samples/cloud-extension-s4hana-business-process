# Prepare Development Environment for the SAP Cloud Application Programming Model

## Introduction

With this guide you will set up Node, create a new GitHub Repository and prepare Visual Studio code for development on your local machine. 

**Persona:** BTP Developer

### Set up Node

1.	Open link: 'https://nodejs.org/en/'
2.	Choose and download the recommended version for most users
3.	Follow the instructions to install node

### Choose GitHub Repository

1. Go to 'https://github.com/'
2. Click on "+" and choose *New Repository* in the dropdown
3. Choose a name e.g. "BpValidationS4" and click on checkbox to initialize the repository with README
4. Finish the creation with a click on *Create Repository*


### Prepare your local development environment

1.	Open Visual Studio Code	
2.	Click on *Terminal* and choose *New Terminal* in the dropdown menu	
   ![New Terminal](././images/develop-application-1a.png)
3.	To set the SAP npm registry write following command into the terminal: 
```
**npm set @sap:registry=https://npm.sap.com**
```
4. Run command 

```
npm i -g @sap/cds-dk
```

5.	Clone the repository you created ealier with executing the command: 

```
git clone <Repository-link>
```
6.	Install cds with the command: 

```
npm i -g @sap/cds-dk
```
7.	Change the directory to the directory right above the repository. 
```
cd repo
```

8.	Initialize CDS 
```
cds init BpValidationMockS4
```![image](https://user-images.githubusercontent.com/72131660/114375655-2e057f80-9b85-11eb-9676-d4eb45ad7420.png)

