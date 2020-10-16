

module.exports = async srv => {
  const {BusinessPartnerAddress, Notifications, Addresses, BusinessPartner} = srv.entities;
  const bupaSrv = await cds.connect.to("API_BUSINESS_PARTNER");
  const messaging = await cds.connect.to('messaging')
  const namespace = messaging.options.credentials && messaging.options.credentials.namespace

  const {postcodeValidator} = require('postcode-validator');
  
  srv.on("READ", BusinessPartnerAddress, req => bupaSrv.tx(req).run(req.query))
  srv.on("READ", BusinessPartner, req => bupaSrv.tx(req).run(req.query))

  messaging.on("refapps/bpems/abc/S4H/BO/BusinessPartner/Created", async msg => {
    console.log("<< event caught", msg);
    const BUSINESSPARTNER = (+(msg.data.KEY[0].BUSINESSPARTNER)).toString();
    // ID has prefix 000 needs to be removed to read address
    console.log(BUSINESSPARTNER);
    const bpEntity = await bupaSrv.tx(msg).run(SELECT.one(BusinessPartner).where({businessPartnerId: BUSINESSPARTNER}));
    const result = await cds.tx(msg).run(INSERT.into(Notifications).entries({businessPartnerId:BUSINESSPARTNER, verificationStatus_code:'N', businessPartnerName:bpEntity.businessPartnerName}));
    const address = await bupaSrv.tx(msg).run(SELECT.one(BusinessPartnerAddress).where({businessPartnerId: BUSINESSPARTNER}));
    // for the address to notification association - extra field
    if(address){
      const notificationObj = await cds.tx(msg).run(SELECT.one(Notifications).columns("ID").where({businessPartnerId: BUSINESSPARTNER}));
      address.notifications_id=notificationObj.ID;
      const res = await cds.tx(msg).run(INSERT.into(Addresses).entries(address));
      console.log("Address inserted");
    }
  });

  messaging.on("refapps/bpems/abc/S4H/BO/BusinessPartner/Changed", async msg => {
    console.log("<< event caught", msg);
    const BUSINESSPARTNER = (+(msg.data.KEY[0].BUSINESSPARTNER)).toString();
    const bpIsAlive = await cds.tx(msg).run(SELECT.one(Notifications, (n) => n.verificationStatus_code).where({businessPartnerId: BUSINESSPARTNER}));
    if(bpIsAlive && bpIsAlive.verificationStatus_code == "V"){
      const bpMarkVerified= await cds.tx(msg).run(UPDATE(Notifications).where({businessPartnerId: BUSINESSPARTNER}).set({verificationStatus_code:"C"}));
    }    
    console.log("<< BP marked verified >>")
  });

  srv.after("UPDATE", "Notifications", (data, req) => {
    console.log("Notification update", data.businessPartnerId);
    if(data.verificationStatus_code === "V" || data.verificationStatus_code === "INV")
    emitEvent(data, req);
  });

  srv.before("SAVE", "Notifications", req => {
    if(req.data.verificationStatus_code == "C"){
      req.error({code: '400', message: "Cannot mark as COMPLETED. Please change to VERIFIED", numericSeverity:2, target: 'verificationStatus_code'});
    }
  });

  srv.before("PATCH", "Addresses", req => {
    // To set whether address is Edited
    req.data.isModified = true;
  });

  srv.after("PATCH", "Addresses", (data, req) => {
    const isValidPinCode = postcodeValidator(data.postalCode, data.country);
    if(!isValidPinCode){
      return req.error({code: '400', message: "invalid postal code", numericSeverity:2, target: 'postalCode'});
    } 
    return req.info({numericSeverity:1, target: 'postalCode'});  
  });

  function emitEvent(result, req){
    // const result =  await cds.run(SELECT.one.from("my.businessPartnerValidation.Notification as N").leftJoin("my.businessPartnerValidation.Address as A").on({"N.businessPartnerId":"A.businessPartnerId"}).where("N.businessPartnerId", bp));
    const statusValues={"N":"NEW", "P":"PROCESS", "INV":"INVALID", "V":"VERIFIED"}
    // Format JSON as per serverless requires
    const payload = {
      "businessPartner": result.businessPartnerId,
      "businessPartnerName": result.businessPartnerName,
      "verificationStatus": statusValues[result.verificationStatus_code],
      "addressId":  result.addresses && result.addresses[0].addressId,
      "streetName":  result.addresses && result.addresses[0].streetName,
      "postalCode":  result.addresses && result.addresses[0].postalCode,
      "country":  result.addresses && result.addresses[0].country,
      "addressModified":  result.addresses && result.addresses[0].isModified
    }

    console.log("<< formatted >>>>>", payload);
    messaging.tx(req).emit(`${namespace}/SalesService/d41d/BusinessPartnerVerified`, payload)
  }

  
}
