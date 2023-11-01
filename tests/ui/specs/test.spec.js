const bpApi = require("../services/bpApi");
const bpApiService = require("../services/bpApi");
const {newBp , newAdr} = require("../services/mockData");
const endPoint = require("../../util/config").bp_app;

let fioriElementsFacade;

before(async () => { 
   //initialize the list report and object pages
    try{
        fioriElementsFacade = await browser.fe.initialize({
            onTheMainPage: {
                ListReport: {
                    appId: "com.sap.bp.BusinessPartners",
                    componentId: "NotificationList",
                    entitySet: "Notifications"
                }
            },
        
            onTheDetailPage: {
                ObjectPage: {
                    appId: "com.sap.bp.BusinessPartners",
                    componentId: "NotificationObjectPage",
                    entitySet: "Notifications"
                }
            },

            onTheShell: {
                Shell:{}
            }
        });

        console.log("Test library integrated")
    }
    catch(err){
        console.log(`Could not integrate test library: ${err}`)
        process.exit()
    }
});

describe("Before Validating the application", () => {
    // create mock BP before executing any test suites
    it("Create test data", async() => {
        response = await bpApiService.postMethod(browser)
        try{   
            expect(response.status).toEqual(201)
            // response.should.have.status(201)
            console.log(`Business Partner created : ${response.data.BusinessPartnerName}`)
        }
        catch(err){
            console.error(err)
            console.log("Business Partner not created");
            console.log(`Error Code : ${response.status}`)
            await browser.closeWindow()
            process.exit()
        }
    })
})
describe("After test data is created", () => {

    it("Validations on table on list report page", async () => {
        await fioriElementsFacade.execute(async(Given, When, Then) => {
            console.log("Table validation")

            //ensure the man page has loaded
            Then.onTheMainPage.iSeeThisPage()
            //display all rows of the table 
            When.onTheMainPage.onFilterBar().iExecuteSearch()

            //verify data of the mock BP created
            Then.onTheMainPage.onTable().iCheckRows(
                mRowValues = { 
                    0 : newBp.BusinessPartner,
                    1 : newBp.BusinessPartnerName,
                    2 : "NEW" 
                }
            )

            //aggrgate the rows by a particular verification status column
            When.onTheMainPage.onTable().iAggregateByColumn(
                vColumnIdentifier = { name : "Verification Status" },
                sFieldLabel = "Verification Status (Verification Status)"
            )

            // change sorting order and check the same
            When.onTheMainPage.onTable().iChangeSortOrder(
                vColumnIdentifier = { name : "verificationStatus_code" },
                sSortOrder = "Descending"
            )
            
            //to undo the column aggregation
            When.onTheMainPage.onTable().iAggregateByColumn(
                vColumnIdentifier = { name : "Verification Status" },
                sFieldLabel = "Verification Status (Verification Status)"
            )

        })
    });

    it("Validations on filter bar on list report page", async () => {
        await fioriElementsFacade.execute(async(Given, When, Then) => {
            
            console.log("Filter bar validation")
            Then.onTheMainPage.iSeeThisPage()
            When.onTheMainPage.onFilterBar().iExecuteSearch()

            // Search with filter field business partner ID
            When.onTheMainPage.onFilterBar().iChangeFilterField(
                    vFieldIdentifier = { property : "businessPartnerId" },
                    vValue = newBp.BusinessPartner
            ).and.iExecuteSearch()

            Then.onTheMainPage.onTable().iCheckRows(
                mRowValues = { 1 : newBp.BusinessPartnerName },
                iExpectedNumberOfRows = 1
            )

            When.onTheMainPage.onFilterBar().iChangeFilterField(
                vFieldIdentifier = { property : "businessPartnerId" },
                bClearFirst = true
            )

            //Search with filter field business partner name
            When.onTheMainPage.onFilterBar().iChangeFilterField(
                vFieldIdentifier = { property : "businessPartnerName" },
                vValue = newBp.BusinessPartnerName
            ).and.iExecuteSearch()
            
            Then.onTheMainPage.onTable().iCheckRows(
                mRowValues = { 0 : newBp.BusinessPartner },
                iExpectedNumberOfRows = 1
            )

            When.onTheMainPage.onFilterBar().iChangeFilterField(
                vFieldIdentifier = { property : "businessPartnerName" },
                bClearFirst = true
            )

            // Search with filter field verification status
            When.onTheMainPage.onFilterBar().iChangeFilterField(
                vFieldIdentifier = { property : "verificationStatus_code" },
                vValue = "NEW (N)"
            ).and.iExecuteSearch()
            
            Then.onTheMainPage.onTable().iCheckRows( iExpectedNumberOfRows = 2 )

            When.onTheMainPage.onFilterBar().iChangeFilterField(
                vFieldIdentifier = { property : "verificationStatus_code" },
                bClearFirst = true
            )

            // Search with the search field
            When.onTheMainPage.onFilterBar().iChangeSearchField( 
                newBp.BusinessPartnerName 
            ).and.iExecuteSearch()

            Then.onTheMainPage.onTable().iCheckRows(
                mRowValues = { 0 : newBp.BusinessPartner },
                iExpectedNumberOfRows = 1
            )

            When.onTheMainPage.onFilterBar().iResetSearchField().and.iExecuteSearch()

        })
    });

    it("Validations on the object page", async()=>{
        await fioriElementsFacade.execute(async (Given, When, Then) => {

            console.log("Object page validation")
            Then.onTheMainPage.iSeeThisPage()
            //display the table on the list report page
            When.onTheMainPage.onFilterBar().iExecuteSearch()
            //click on the specific row to see object page
            When.onTheMainPage.onTable().iPressRow({ "Business Partner ID" : newBp.BusinessPartner })
            Then.onTheDetailPage.iSeeThisPage()

            //verify title and details on header : Name and Verification Status
            Then.onTheDetailPage.onHeader().iCheckTitle(sTitle = newBp.BusinessPartner)

            Then.onTheDetailPage.onHeader().iCheckDataPoint(
                sTitle = "Business Partner Name",
                sValue = newBp.BusinessPartnerName
            )

            Then.onTheDetailPage.onHeader()
            .iCheckFieldInFieldGroup(
                vFieldIdentifier = {
                    fieldGroup : "FieldGroup::Detail",
                    field  : "verificationStatus_code"
                },
                value = "N" 
            )

            //verify address details
            Then.onTheDetailPage
            .onTable({property : "addresses"})
            .iCheckRows(
                vRowValues = {
                    0 : newBp.to_BusinessPartnerAddress[0].AddressID, 
                    1 : newBp.BusinessPartner,
                    2 : newBp.to_BusinessPartnerAddress[0].StreetName,
                    3 : newBp.to_BusinessPartnerAddress[0].CityName,
                    4 : newBp.to_BusinessPartnerAddress[0].Country,
                    5 : newBp.to_BusinessPartnerAddress[0].PostalCode
                },
                iExpectedNumberOfRows = 1
            )

            //check and edit object page
            Then.onTheDetailPage.onHeader().iCheckEdit()            
            When.onTheDetailPage.onHeader().iExecuteEdit()


            //edit verification status, save and verify change
            When.onTheDetailPage
            .onForm( vFormIdentifier = { isHeaderFacet : true } )
            .iChangeField(
                { property : "verificationStatus_code" },
                "V"    
            )

            When.onTheDetailPage
            .onTable({property : "addresses"})
            .iChangeRow(
                vRowValues = 0,
                mTargetValues = {
                    2 : newAdr.Street,
                    5 : newAdr.PostalCode
                }
            )

            When.onTheDetailPage.onFooter().iExecuteSave();
        
            Then.onTheDetailPage.onHeader()
            .iCheckFieldInFieldGroup(
                vFieldIdentifier = {
                    fieldGroup : "FieldGroup::Detail",
                    field  : "verificationStatus_code"
                },
                value = "V" 
            )

            Then.onTheDetailPage
            .onTable({property : "addresses"})
            .iCheckRows(
                vRowValues = {
                    2 : newAdr.Street,
                    5 : newAdr.PostalCode
                },
                iExpectedNumberOfRows = 1
            )

        })
    });

})
describe("After validation of the application", async() => {

    it("Delete the test data from table", async()=>{
        await browser.url(endPoint.main);

        await fioriElementsFacade.execute(async(Given, When, Then) => {

            Then.onTheMainPage.iSeeThisPage()
            When.onTheMainPage.onFilterBar().iExecuteSearch()

            Then.onTheMainPage.onTable().iCheckRows(
                mRowValues = { 1 : newBp.BusinessPartnerName, 2 : "COMPLETED" },
                iExpectedNumberOfRows = 1
            )

            //select the row with the created BP
            When.onTheMainPage.onTable()
            .iSelectRows(vRowValues = { "Business Partner ID" : newBp.BusinessPartner })
            .and
            .iExecuteDelete()

            //confirm the dialog that pops up
            When.onTheMainPage.onDialog().iConfirm();

            Then.onTheMainPage.onTable().iCheckRows(
                mRowValues = { 1 : newBp.BusinessPartnerName},
                iExpectedNumberOfRows = 0
            )
        })
    })
    //delete the created BP from mockserver
    it("Delete test data from mock server", async() => {
        response = await bpApiService.deleteMethod(browser)
        try{
            expect(response.status).toEqual(204)
            // expect(response.status).to.be.equal(204) 
            console.log("Business Partner Deleted from mock server")
        }
        catch(err){
            console.error(err)
            console.log("Business Partner not deleted properly from mock server");
            console.log(`Error Code : ${response.status}`)
            await browser.closeWindow()
            process.exit()
        }
    });
})
    