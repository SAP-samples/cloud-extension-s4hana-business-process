const cds = require('@sap/cds');
const { expect } = require('chai');
const {GET, POST, PATCH, DELETE} = cds.test('serve', '--in-memory', '--with-mocks').in(__dirname + '/../../')//.verbose(true)

const basicAuth = {
    "headers": {
        "Authorization": `Basic ${Buffer.from("admin:admin").toString('base64')}`
    }
}
describe("Sanity Test", ()=> {

    describe('GET /sales/Notifications', () => {
        // API access
        it("+ Should return list of notifications", async () => {
            const response = await GET("/sales/Notifications", basicAuth);
                expect(response.status).to.eql(200);
                expect(response.data.value.length).to.eql(2)
        })

        // Programatic access
        it("+ should return one notification", async () => {
            const SalesService = await cds.connect.to("service.businessPartnerValidation.SalesService");
            const {Notifications} = SalesService.entities;
            const result = await SELECT.one(Notifications);
            expect(result).to.deep.contains({businessPartnerId: '17100001', businessPartnerName: 'TestData1'})
        })

    })

    describe("GET /api-business-partner/A_BusinessPartner", () => {
        it("+ should return a list of Mock BusinessPartners", async () => {
            const response = await GET("/api-business-partner/A_BusinessPartner")

            expect (response.status).to.eql(200);
        })
    })
})

describe("Business Partner Validation", () => {
    it("+ create new business partner", async () => {
        const payload = {
			"BusinessPartner":"17100015",
			"BusinessPartnerIsBlocked":true,
			"BusinessPartnerFullName": "John Doee"
		}
        const response = await POST("/api-business-partner/A_BusinessPartner", payload);
        expect(response.status).to.eql(201)
    })

    it("+ should return a list of new notifications", async () => {
        const response = await GET(`/sales/Notifications?$filter=businessPartnerId eq '17100015'`, basicAuth);
        expect(response.status).to.eql(200)
        expect(response.data.value).to.exist
        expect(response.data.value[0]).to.contains({"businessPartnerName": "John Doee"});
    })

    describe("Draft Choreography APIs", () => {
        it("+ set the Notification to draft", async () => {
            const response = await POST(`/sales/Notifications(ID=2c728381-72ce-4fdd-8293-8add71579666,IsActiveEntity=true)/service.businessPartnerValidation.SalesService.draftEdit?$select=HasActiveEntity,HasDraftEntity,ID,IsActiveEntity,businessPartnerId,businessPartnerName,verificationStatus_code&$expand=DraftAdministrativeData($select=DraftUUID,InProcessByUser),verificationStatus($select=code,updateCode)`,
                            {"PreserveChanges":true}, basicAuth )
            expect(response.status).to.eql(201)
        })

        it("+ Patch the chanages", async () => {
            const response = await PATCH(`/sales/Notifications(ID=2c728381-72ce-4fdd-8293-8add71579666,IsActiveEntity=false)`, 
                            {"verificationStatus_code": "V"}, basicAuth)
            expect(response.status).to.eql(200)
        })

        it("+ Side effects qualifier", async () => {
            const response = await POST(`/sales/Notifications(ID=2c728381-72ce-4fdd-8293-8add71579666,IsActiveEntity=false)/service.businessPartnerValidation.SalesService.draftPrepare`,
                            { "SideEffectsQualifier": "" }, basicAuth)
            expect(response.status).to.eql(200)
        })

        it("+ Activate the draft", async () => {
            const response = await POST(`/sales/Notifications(ID=2c728381-72ce-4fdd-8293-8add71579666,IsActiveEntity=false)/service.businessPartnerValidation.SalesService.draftActivate?$select=HasActiveEntity,HasDraftEntity,ID,IsActiveEntity,businessPartnerId,businessPartnerName,verificationStatus_code&$expand=DraftAdministrativeData($select=DraftIsCreatedByMe,DraftUUID,InProcessByUser),verificationStatus($select=code,updateCode)`,
                            {}, basicAuth)
            expect(response.status).to.eql(201)
        })

        it("+ Test the verfication status", async () => {
            const response = await GET(`/sales/Notifications(ID=2c728381-72ce-4fdd-8293-8add71579666,IsActiveEntity=true)`, basicAuth)
            expect(response.status).to.eql(200)
            expect(response.data).to.deep.contains({"verificationStatus_code": "C"})
        })

        it("- Delete the Notification", async () => {
            const response = await DELETE(`/sales/Notifications(ID=2c728381-72ce-4fdd-8293-8add71579666,IsActiveEntity=true)`, basicAuth)
            expect(response.status).to.eql(204)
        });
    })

});
