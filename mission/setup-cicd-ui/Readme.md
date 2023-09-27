# Setup CI/CD Pipeline

This section describes how to configure and run a predefined continuous integration and delivery (CI/CD) pipeline that automatically performs ui tests on your deployed application.

First we need to deploy our mock server separately. This is because currently BTP CI/CD does not support the usage of submodules. Thus it cannot be deployed in the same mta.yaml as the validation app. The below steps showcase how to deploy the mock server alone:

1. Run mbt build in the mock-srv folder
2. Execute cf deploy mta_arachives 
3. Next run sh create-destination.sh to create a destination for the newly deployed mock server
4. Make note of the deployed url of the mock server

Now in the same space the mock server is deployed in, we would need to deploy the validation app as well. Follow the below steps to achieve this:

1. In the mta.yaml file change instance to subaccount. This will prevent the deployed application from having a guid in the URL, thus making it easy for us to predict and we will see why this is needed in a while.
2. Push these changes to your repository


The steps below will guide your through setting up your pipeline.

1. [Optional:] Make sure you have [enabled the SAP Continuous Integration and Delivery service](https://developers.sap.com/tutorials/btp-app-ci-cd-btp.html#8bee3e93-2873-4eaf-8b07-8ae0d4aba08b) in your BTP account (In case you have used the Booster to set up the account you already have the entitlement)

2. Make sure that by this moment that you have connected your project to a GitHub repository.

-  Go to the GitHub repository for this mission 
-  Fork the GitHub repository

3. Open Continuous Integration & Delivery application

- Choose **Services** &rarr; **Instances and Subscriptions**
- Find **Continuous Integration & Delivery** 
- Click on name to open the application

 ![configure pipeline](./images/cicd2.png)
 
 4. Now you are on the home page of Continuous Integration & Delivery, where you can configure jobs, repositories and credentials. 

 5. Start by adding your GitHub credentials to connect SAP Continuous Integration and Delivery to your repository. Choose **Credentials**, then click on the **+** icon
 
 5.1 In the pop-up add following data:
 - Name: "github"
 - Username: add your GitHub username/ id
 - Password: enter your GitHub access token 
 
   ![create credentials](./images/ci-cd-3.png)

 5.2 Choose **create** to finish.

 6. Back in the **Credentials** section choose **+** icon to add a second credential for deploying to SAP BTP, Cloud Foundry environment.

 6.1 In the pop-up add following data:
 - Name: "cf"
 - Username: add your global user name
 - Password: enter global password
 
   ![create credentials](./images/ci-cd-2.png)
 
 6.2 Choose **create** to finish.

7. Navigate to **Jobs** tab in SAP Continuous Integration and Delivery and choose  **+** to create a new job.

7.1 In _General Information_ add a _Job Name, e.g.,  CustomLogic

7.2 Choose **add repository** to add your repository you have created in step 2.
 
  ![add job](./images/ci-cd-1.png)

8. In the pop-up you can configure the connection to your repository:
 - Name: "customLogicRepo"
 - Clone Url: provide URL of your repository
 - Credentials: select the github credentials that you have created in step 5

 Choose **Create**.
 
  ![add repositories](./images/ci-cd-4.png)


9. Back in the **General Information** section you can further configure your Job
  - Branch: select your github branch, in this example 'main'
  - Pipeline: select SAP Cloud Application Programming Model

  ![general information](./images/ci-cd-5.png)

10. Scroll down to **Stages** --> **Build** and select the build tools:
- Build Tool: mta
- Build Tool Version: Select the latest version

  ![build](./images/ci-cd-6.png)

11. Scroll down to **Acceptance** and switch on the toggle to allow the executing of the ui tests. 

  ![unit tests](./images/ci-cd-7.png)

12. Under Webdriverio Test

    Add wdi5 as your npm script
    For base URL : string it as the following !!! steps to string together URL !!!

13. Go to Additional Credentials and click create. Give it the name wdi5_password and add the credential created above.

14. Next go to Additional Variables and add the following names with the corresponding variables:
        mockUrl : 
        appAuth : 
        wdi5_username : 

15. Finish the job creation by choosing **Create**

20. Now you can test your job manually the first time after creation. Go back to the **SAP Continuous Integration and Delivery** application and navigate to the **Job** tab

21. Choose the name of your created job and choose **Run**

  ![test](./images/ci-cd-13.png)

22. Verify that a new tile appears in the Builds view. This tile should be marked as running.

  ![test](./images/ci-cd-14.png)

23. Wait until the job has finished and verify that the build tile is marked as successful.

  ![test](./images/ci-cd-15.png)

Now you can go back and undeploy your application using the cf undeploy command. Please ensure to manually delete the destination from the cockpit as it would not be removed during the undeployment stage due it being a subaccount level destination.