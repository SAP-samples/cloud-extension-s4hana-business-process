const axios = require('axios');
const bP = require("./mockData").newBp
const endPoint = require("../../util/config").mock

class BpApiService {
    async postMethod(browser) {
          try {
            let response = await axios.post(`${endPoint.url}`, bP);
            return response;
          } 
          
          catch(err) {
            console.log(`Status : ${err.response.data.error.code}`)
            console.log(`Error Message : ${err.response.data.error.message}`)
            await browser.closeWindow()
            process.exit();
          }
      }

    async deleteMethod() {
      try{
            let response = await axios.delete(`${endPoint.url}('${bP.BusinessPartner}')`)
            return response
      }

      catch(err){
          console.log(`Status : ${err.response.data.error.code}`)
          console.log(`Error Message : ${err.response.data.error.message}`)
          await browser.closeWindow()
          process.exit();
      }
    }
}
module.exports = new BpApiService();