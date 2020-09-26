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
		const msg = JSON.parse(event.data);
		const response = await httpclientaxios.postImage(context, msg, event);
		return response;
}