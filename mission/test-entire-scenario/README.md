## Test Entire Business Scenario End to End
1. Start your Business Partner Validation Application

- In the command line interface run the command *cf apps*

- Find the URL for the app BusinessPartnerValidation-ui - this is the launch URL for the Business Partner Validation application.

- Launch the URL in a browser.

- Click on Business Partner Validation tile

- The list of BusinessPartners along with their verification status gets displayed.

 ![app](./images/endtoend2.png)

2. Login to your SAP S/4HANA On Prem System

 ![backend](./images/endtoend3.png)

3. Enter transaction code *bp*

 ![backend](./images/endtoend4.png)

4. Create a new Business Partner

- Click on Person

 ![backend](./images/endtoend5.png)
 
- Provide first name, last name for the business partner
 
 ![backend](./images/endtoend6.png)
  
- Provide the address  
  
 ![backend](./images/endtoend7.png)
 
 - Move to the status tab and check mark the 'Central Block' lock. Save the BP. This will create a new Business Partner
   
 ![backend](./images/endtoend8.png)

5. Now go back to the BusinessPartnerValidation application to see if the new BusinessPartner has appeared as a new entry in the UI

 ![app](./images/endtoend9.png)

6. Go to the details page for the new BusinessPartner.
7. Click on Edit and set the Status to *Verified*

 ![backend](./images/endtoend10.png)

8. (Optional) You can configure Event Mesh in a way so that you can see the created Event. For that you could create an additional queue that subscribes to the topic as well.

 ![backend](./images/endtoend11.png)

9. Go to your S/4HANA On Prem System 
10. Go to transaction *bp*

 ![backend](./images/endtoend4.png)

11. Open the details of the Business Partner you have just set to *Verified*

 ![backend](./images/endtoend12.png)

12. Go to the Status tab. You can see that the central Block lock has been removed.

 ![backend](./images/endtoend13.png)

13. The serverless application has also uploaded a QR code for the address details of the BP to the S/4HANA system. You can view this by clicking on the icon in the top left corner. You will have to give permission for downloading the image.

 ![backend](./images/endtoend14.png)
 
 ![backend](./images/endtoend15.png)

14. (Optional) Go to the Extension Center and check on the logs for your Serverless Function 

 ![backend](./images/endtoend16.png)
