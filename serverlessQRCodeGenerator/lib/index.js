/**
 * @namespace Faas
 * @typedef {import("@sap/faas").Faas.Event} Faas.Event
 * @typedef {import("@sap/faas").Faas.Context} Faas.Context
 */
const httpclientaxios = require("./httpclientaxios");
/**
 * @param {Faas.Event} event
 * @param {Faas.Context} context
 * @return {Promise<*>}
 */

module.exports = async function (event, context) {
		let msg;
		try {
			msg = JSON.parse(event.data);
		} catch (e) {
		   if(event.data){
				msg =  event.data
		  	}else{
				  return "Looks like there is some issue with the data format. Expected data format: JSON/String";
			  }
		}
		const response = await httpclientaxios.postImage(context, msg, event);
		return response;
}
