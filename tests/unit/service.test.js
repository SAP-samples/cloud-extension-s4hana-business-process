const SalesService = require('../../srv/service.js');


describe("Unit Test suite for methods", () => {
    let salesService, bupaSrv, cdsSpy, LOG;

    beforeAll(() => {

        bupaSrv = jest.fn();
        bupaSrv.run = jest.fn();

        jest.spyOn(cds.ql, 'UPDATE').mockImplementation(() => {
            return {
                "set": jest.fn().mockImplementation(() => {
                    return {
                        "where": jest.fn()
                    }
                })
            }
        })
        LOG = cds.log("Test cases")

    })
    beforeEach(async () => {
        salesService = new SalesService();
    })

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("bupaSrv .toBeCalled() once on emitEvent", async () => {

        const payload = {
            "businessPartnerId": "123",
            "addresses": [{
                "addressId": "1",
                "isModified": false,
            }]
        }
        cdsSpy = jest.spyOn(cds, 'run').mockResolvedValue(payload)
        await salesService.emitEvent(bupaSrv, {}, LOG);
        expect(cdsSpy).toBeCalled()
        expect(bupaSrv.run).toBeCalled()
    })

    it("bupaSrv .toBeCalled() twice on emitEvent", async () => {

        const payload = {
            "businessPartnerId": "123",
            "addressId": "1",
            "searchTerm1": "V",
            "streetName": "XX",
            "postalCode": "XX",
            "addresses": [{
                "isModified": true
            }]
        }
        cdsSpy = jest.spyOn(cds, 'run').mockResolvedValue(payload)
        await salesService.emitEvent(bupaSrv, {}, LOG);
        expect(cdsSpy).toBeCalled()
        expect(bupaSrv.run).toHaveBeenCalledTimes(2)
    })

    it("readMsg returns correct BUSINESSPARTNER for s/4Hana 2019", async () => {
        const msg = { data: { KEY: [{ BUSINESSPARTNER: "1234" }] } };
        let bp = salesService.readMsg(msg)
        expect(bp).toBe("1234")
    })

    it("readMsg returns correct BUSINESSPARTNER for s/4Hana 2020 and above", async () => {
        const msg = { data: { BusinessPartner: "1234" }, headers: { specversion: "1.0" } };
        let bp = salesService.readMsg(msg)
        expect(bp).toBe("1234")
    })

    it("validatePostcode returns true for correct postal code", async () => {
        const payload = {
            addressId: '124462',
            country: 'DE',
            cityName: 'Walldorf'
        }
        const cdsSpy = jest.spyOn(cds, 'run').mockResolvedValue(payload);
        const data = {
            postalCode: '99998',
            isModified: true
        }
        const isValidPinCode = await salesService.validatePostcode(data, LOG);
        expect(cdsSpy).toBeCalled();
        expect(isValidPinCode).toBe(true)
    })

    it("validatePostcode returns false for incorrect postal code", async () => {
        const payload = {
            addressId: '1234',
            country: 'DE',
            cityName: 'Walldorf'
        }
        const cdsSpy = jest.spyOn(cds, 'run').mockResolvedValue(payload);
        const data = {
            postalCode: '123456',
            isModified: true
        }
        const isValidPinCode = await salesService.validatePostcode(data, LOG);
        expect(cdsSpy).toBeCalled();
        expect(isValidPinCode).toBe(false)
    })
})