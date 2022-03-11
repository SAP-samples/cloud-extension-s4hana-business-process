# Build and Deploy CAP Application

We will now build and deploy the CAP application.

1. Go to Business Application Studio

2. Open a terminal

3. Enter and execute the following commands:

- cf login -u <user> -p <password>
- cf api <api endpoint>
- cf target -o org -s space
- mbt build -p=cf
- cf deploy mta_archives/app_1.1.0.mtar  
  
4. Open your app in the browser

- you can get the URL to open by executing *cf apps* and copying the URL for your app. 
