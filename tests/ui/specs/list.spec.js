const bpApi = require("../services/bpApi");
const bpApiService = require("../services/bpApi");
const bp = require("../services/mockData");
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
        if(response.status === 201){
            console.log(`Business Partner created : ${response.data.BusinessPartnerName}`)
        }
        else{
            console.log("Business Partner not created");
            console.log(`Error Code : ${response.status}`)
            await browser.closeWindow()
            process.exit()
        }
    })
})

describe("After mock Business Partner is created", () => {

    it("Validations on table on list report page", async () => {
        await fioriElementsFacade.execute(async(Given, When, Then) => {
            console.log("Table validation")
            //display all rows of the table and verify
            When.onTheMainPage.onFilterBar().iExecuteSearch()

            //verify data of the mock BP created
            Then.onTheMainPage.onTable().iCheckRows(
                mRowValues = { 
                    0 : bp.BusinessPartner,
                    1 : bp.BusinessPartnerName,
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
                    vValue = bp.BusinessPartner
            ).and.iExecuteSearch()

            Then.onTheMainPage.onTable().iCheckRows(
                mRowValues = { 1 : bp.BusinessPartnerName },
                iExpectedNumberOfRows = 1
            )

            When.onTheMainPage.onFilterBar().iChangeFilterField(
                vFieldIdentifier = { property : "businessPartnerId" },
                bClearFirst = true
            )

            //Search with filter field business partner name
            When.onTheMainPage.onFilterBar().iChangeFilterField(
                vFieldIdentifier = { property : "businessPartnerName" },
                vValue = bp.BusinessPartnerName
            ).and.iExecuteSearch()
            
            Then.onTheMainPage.onTable().iCheckRows(
                mRowValues = { 0 : bp.BusinessPartner },
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
                bp.BusinessPartnerName 
            ).and.iExecuteSearch()

            Then.onTheMainPage.onTable().iCheckRows(
                mRowValues = { 0 : bp.BusinessPartner },
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
            When.onTheMainPage.onTable().iPressRow({ "Business Partner ID" : bp.BusinessPartner })
            Then.onTheDetailPage.iSeeThisPage()

            //verify title and details on header : Name and Verification Status
            Then.onTheDetailPage.onHeader().iCheckTitle(sTitle = bp.BusinessPartner)

            Then.onTheDetailPage.onHeader().iCheckDataPoint(
                sTitle = "Business Partner Name",
                sValue = bp.BusinessPartnerName
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
                    0 : bp.to_BusinessPartnerAddress[0].AddressID, 
                    1 : bp.BusinessPartner,
                    2 : bp.to_BusinessPartnerAddress[0].StreetName,
                    3 : bp.to_BusinessPartnerAddress[0].CityName,
                    4 : bp.to_BusinessPartnerAddress[0].Country,
                    5 : bp.to_BusinessPartnerAddress[0].PostalCode
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

            When.onTheDetailPage.onFooter().iExecuteSave();
        
            Then.onTheDetailPage.onHeader()
            .iCheckFieldInFieldGroup(
                vFieldIdentifier = {
                    fieldGroup : "FieldGroup::Detail",
                    field  : "verificationStatus_code"
                },
                value = "V" 
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
                mRowValues = { 1 : bp.BusinessPartnerName, 2 : "COMPLETED" },
                iExpectedNumberOfRows = 1
            )

            //select the row with the created BP
            When.onTheMainPage.onTable()
            .iSelectRows(vRowValues = { "Business Partner ID" : bp.BusinessPartner })
            .and
            .iExecuteDelete()

            //confirm the dialog that pops up
            When.onTheMainPage.onDialog().iConfirm();
        })
    })
    //delete the created BP from mockserver
    it("Delete test data from mock server", async() => {
        response = await bpApiService.deleteMethod(browser)
        if(response.status === 204){
            console.log("Business Partner Deleted from mock server")
        }
        else{
            console.log("Business Partner not deleted properly from mock server");
            console.log(`Error Code : ${response.status}`)
            await browser.closeWindow()
            process.exit()
        }
    });
})
    