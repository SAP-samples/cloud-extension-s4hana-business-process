# RefappQRCodeGenerator

This serverless function created as a utility is used by the to generate a QR Code for the updated Business Partner address. It uploads the same to S4HANA on premise system alone with the business partner details.

This implementation showcases: 
  - [SAP BTP, Serverless runtime service](https://help.sap.com/viewer/bf7b2ff68518427c85b30ac3184ad215/Cloud/en-US/7b8cc2b0e8d141d6aa37c7dff4d70b82.html):
  - AMQP trigger for invoking the serverless function
  - oData Provisioning for registering the S4HANA oData Services(API_BUSINESS_PARTNER and API_CV_ATTACHMENT_SERVICE)
  - Consumption of the registered S/4HANA oData services from a serverless function

## Enable IWBEP component in the S4HANA system
1. Login to S4HANA System
2. run transaction sicf
3. click on execute
4. Traverse to default -> host -> sap -> iwbep -> right click -> activate service

## Register Odata Service and Configure Destinations
1. Create a destination in the SAP BTP Cockpit
 url : http://xxx:xxx/sap/iwbep?sap-client=100
 Proxy Type : On-Premise
 Authentication: Basic
 Location Id : CC location Id
 User: S4HANA System User name
 Password: S4HANA System password
 Additional Properties:
 odc: true
2. Login to Extension Center
3. Services -> Register 
4. Register API_BUSINESS_PARTNER  and API_CV_ATTACHMENT_SRV services 
5. Click on the service API_BUSINESS_PARTNER and copy the service url till SAP eg., https://xxx.xxxx.services.xfs.cloud.sap/odata/SAP/

## Deployment - Business Application Studio

Login to Business Application Studio

Enable "Extension Factory Serverless Runtime Development" while creating dev space in BizAppStudio.

```bash
cf login -u 'inumber' -p 'passowrd'
```
 
create xfsrt service instance: 
```bash
cf create-service xfs-runtime default extension -c '{\"extensions\": true, \"odp\": true}'
```

create service key for the xfsrt instance : 
```bash
cf create-service-key <XFSRT_SERVICE_INSTANCE_NAME> <XFSRT_SERVICE_KEY_NAME>
```

Create Em service key
```bash
cf create-service-key <ENTERPRISE_MESSAGING_SERVICE_INSTANCE_NAME> <ENTERPRISE_MESSAGING_SERVICE_KEY_NAME>
```

Create destination service service - key
```bash
cf create-service-key <DESTINATION_SERVICE_INSTANCE_NAME> <DESTINATION_SERVICE_KEY_NAME>
```

Login to Serverless instance
```bash
xfsrt-cli login -k <serverless_instance_key_name> -n <service_instance_name>
```

Register Enterprise Messaging Service instance
```bash
xfsrt-cli faas service register -b <Enterprise_Messaging_service_key_name> -s <service_name>
```

Register Destination Service instance
```bash
xfsrt-cli faas service register -b <Destination_service_key_name> -s <service_name>
```

move to project. cd serverlessQRCodeGenerator

Install faas-sdk
```bash
npm install @sap/faas -g
```

Install all required node packages
```bash
npm install
```

First, create a deployment file to provide credentials. Run inside the project directory:
```bash
faas-sdk init-values -y values.yaml
```

Login to BTP cockpit and create a destination
 1. url : using service url from registered odata service
 2. Type: HTTP
 3. Authentication: oAuth2ClientCredentials
 4. clientId : <client Id of xfsrt service instance>
 5. clientSecret: <clientSecret of xfsrt service instance>
 6. Token Service URL: <Token URL from xfsrt service instance>

update values.yaml file with the below values
- Type, instance and key from the details of registered Enterprise Messaging Service and Destination Service. Execute the below command to get the details.
  ```bash
  xfsrt-cli faas service list
  ```
- Update the Name of the destination under secret-values -> destinationname -> name -> name 
- Also update attachmentSrvApi as API_CV_ATTACHMENT_SRV
  businessPartnerSrvApi as API_BUSINESS_PARTNER
  businessObjectTypeName as BUS1006
  under secret-values -> destinationname -> name -> name
- Update the Enterprise messaging queue name under config-values-section -> amqp-service-config -> amqp -> incoming -> inp1 -> sourceAddress appended with "queue:<your queue name>"

And finally run the below command inside the project directory to deploy the project
```bash
 xfsrt-cli faas project deploy -y ./deploy/values.yaml
```

## Test

View the logs of the function from Extension Center.
