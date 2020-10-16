const cds = global.cds || require('@sap/cds')
module.exports = async srv => {
    
    const messaging = await cds.connect.to('messaging')
    // Mock events for s4
    srv.after("CREATE", data => {
        const payload = {KEY: [{BUSINESSPARTNER: data.BusinessPartner}]};
        messaging.emit("refapps/bpems/abc/S4H/BO/BusinessPartner/Created", payload);
        console.log('<< event emitted', payload);
    });

    srv.after("UPDATE", data => {
        const payload = {KEY: [{BUSINESSPARTNER: data.BusinessPartner}]};
        messaging.emit("refapps/bpems/abc/S4H/BO/BusinessPartner/Changed", payload);
        console.log('<< event emitted', payload);
    });
}