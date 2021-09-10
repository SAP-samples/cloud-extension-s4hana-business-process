# Setup CI/CD Pipeline

This section describes how to configure and run a predefined continuous integration and delivery (CI/CD) pipeline that automatically tests, builds, and deploys your code changes to speed up your development and delivery cycles.

The steps below will guide your through settting up your pipeline.

1. Enable SAP Continuous Integration and Delivery (optional Step - if you have executed the Booster you should be good)
- Go to your subaccount in SAP BTP
- Got to the Service Marketplace
- Type Continuous into the Search Box
- Choose Create

 ![choose create](./images/cicd1-1.png)

2. Assign Role Collection

- In your SAP BTP subaccount, choose Security -> Trust Configuration
- Choose the name of your identity provider
- Enter your email address
- Choose Show Assignments
- Choose Assign Role Collection

 ![assign role_collection](./images/cicd1-2.png)

- From the dropdown list, choose CICD Administrator

3. Fork the GitHub repository

- Go to the GitHub repository for this mission 
- Fork the GitHub repository


4. Configure pipeline

- Click on *Service Marketplace* or *Instances and Subscriptions*
- Find *Continuous Integration & Delivery* (you might use the search functionality)
- Click on “Go to application”

 ![configure pipeline](./images/cicd2.png)

5. Add BTP credentials

- Click on credentials tab
- Click on ‘+’

 ![add btp_credentials](./images/cicd3.png)
 
- Enter a freely chosen name for your credential, which is unique in your SAP BTP subaccount. In this example, the name of the credential is *global*.
- As type select *Basic Authentication* 
- For Username, enter your BTP username.
- For Password, enter your BTP password.
- Click on create

 ![add btp_credentials_2](./images/cicd4.png)

6. Add GitHub credentials

- Click on ‘+’
- Enter a freely chosen name for your credential, which is unique in your SAP BTP subaccount. In this example, the name of the credential is *github*.
- As type select *Basic Authentication* 
- For Username, enter your GitHub username.
- For Password, use the personal access token for GitHub (Hint: access tokens can be created in GitHub by going to *Settings* -> *Developer Settings*)
- Click on create

 ![add github_credentials](./images/cicd5.png)
 
7. Configure a CI/CD Job
 
- In the Jobs tab in SAP Continuous Integration and Delivery, choose *+* to create a new job.
- For Job Name, enter a freely chosen name for your job, which is unique in your SAP BTP subaccount, for example ‘CustomLogic’.
- Under Repository, choose Add Repository.
- Add the repository name and the repository URL.
- Select the repository credential from the dropdown. Pick *github*
- Choose *Add*

 ![add repository](./images/cicd5-1.png)

- For Branch, enter the GitHub branch from which you want to receive push events. In this example, main.
- As Pipeline, choose SAP Cloud Application Programming Model.
- Keep the default values in the BUILD RETENTION tab.
- In the Stages tab, choose Job Editor from the Configuration Mode dropdown list.
- For Build Tool, leave mta as preselected.
- Leave the execution of the Maven Static Code Checks step switched off.
- Leave the execution of the Lint Check step switched off.
- Leave the execution of the Additional Unit Tests switched off.
- Switch the execution of the Release stage on.
- Switch the execution of the Deploy to Cloud Foundry step on.
- Replace the placeholders in with the values of the space in the Cloud Foundry environment to which you want to deploy. You can get the values from your subaccount overview in the SAP BTP cockpit. Select the Credentials that you had created earlier for the SAP BTP from the dropdown menu.
- Leave the Upload to Cloud Transport Management step switched off. Select the credentials from the drop down that you had created earlier for the SAP BTP.
- Choose *Create*.

 ![add credentials](./images/cicd6.png)
 
8. Create a GitHub Webhook

To create a webhook in GitHub, you need some data that has been automatically created during the previous step. You can find this data (Payload URL and Secret) when you open the detail view of an existing repository in the Repositories tab

- Click on Repositories
- Open on the Detail View of your repository by clicking on the arrow at the end of the row
- The detail view opens up on the right hand side
- Click on Webhook Data
 
 ![webhook data](./images/cicd6-1.png)
 
- You will see a pop-up like the one below
 
 ![pop up](./images/cicd6-2.png)

9. Add Webhook in GitHub

- In your project in GitHub go to the Settings tab.
- From the navigation pane, choose Webhooks.
- Choose Add webhook.

 ![add_webhook](./images/cicd6-3.png)

10. Configure Webhooks

The data required below can be found in the CI/CD popup.

- Enter payload url
- Select content type as application/json
- Enter the secret

The details to be entered as available in the pop up in CI/CD.

- Click on ‘Add webhook’

 ![add credentials](./images/cicd6-4.png)

11. Add credential to pipeline

- Open pipeline_config.yml file in github
- Edit credentialId and adjust to the one created.
- Click on Commit change

 ![add credentials_to_pipeline](./images/cicd10.png)
 
12. Test the pipeline (optional)
 
 - Go to the terminal in Business Application Studio and sync the changes in GitHub 
 
 ```bash
 git pull
 ```
 
 - Go to Business Application Studio
 - Make a minor change to for example the Readme.MD like e.g. adding a comment
 - Go to the terminal and execute the commands below
 
 ```bash
git add .
git commit -m "minor change"
git push
```
 - Goto the CI/CD app 
 - Check on the right hand side that the build has been triggered
 
  ![test_pipeline](./images/cicd6-5.png)
 

 
