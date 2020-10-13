# Prepare Development Environment for the SAP Cloud Application Programming Model

## Introduction

With this guide you will set up Node, create a new GitHub Repository and prepare Visual Studio code for development on your local machine. 

**Persona:** SCP Developer

### Set up Node

1.	Open link: 'https://nodejs.org/en/'
2.	Choose and download the recommended version for most users
3.	Follow the instructions to install node

### Choose GitHub Repository

1.	Navigate to your *Repository page*
2.	Click on *Repository*, then click the *“+”* in the top right menu and choose *New Repository*
3.	Add the Repository name: 'BpValidationMockS4'
4.	Finish the creation with a click on *Create Repository*

### Prepare your local development environment

1.	Open Visual Studio Code	
2.	Click on *Terminal* and choose *New Terminal* in the dropdown menu	
   ![New Terminal](././images/develop-application-1a.png)
3.	To set the SAP npm registry write following command into the terminal: 
```
npm set @sap:registry=https://npm.sap.com
```
4. Install SQLite3 support using npm

```
npm install --save sqlite3
```

5.	Clone your created repository with executing the command: 

```
git clone <Repository>
```
6.	Install cds with the command: 

```
npm i -g @sap/cds-dk
```
7.	Change the directory to the directory right above the repository. 

8.	Initialize CDS 
```
cds init BpValidationMockS4
```

