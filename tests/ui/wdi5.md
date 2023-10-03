# About the test cases
1. Test cases are in the 'specs' folder
2. The package.json in 'app/BusinessPartners' has additional dependenies needed to run the tests along with a 'wdi5' script to start the test execution
2. Configuration for Webdriverio and wdi5 is in file 'wdio.conf.js', located in the same folder as the above package.json file 

# To run the test cases on jenkins
1. Create a multibranch pipeline on jenkins
2. Ensure that the git plugin is added
3. Add branches resources and configure with the repo and credentials
4. Add a branch as well to indicate the specific branch to run the job on
5. Following this add advanced sub module behaviors and check the update sub modules recursively option
6. In build configuration, make sure the script name is Jenkinsfile
7. Navigate to .pipeline/config.yml and modify the parameters as needed
8. Navigate to Jenkinsfile and modify the credential name 'pusercf' as needed
9. Trigger the pipeline from jenkins

