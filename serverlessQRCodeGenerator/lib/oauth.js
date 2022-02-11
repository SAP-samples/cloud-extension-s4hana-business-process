'use strict';

const oAuthClient = require('client-oauth2');
let cached = null;

/**
 * @param {Faas.Context} context
 * @return {Promise<*>}
 */
async function token(credentials, logger) {
    return new Promise(async (resolve, reject) => {
        const now = Date.now();
        if (cached !== null && now < cached.expires.valueOf() - 2000) {  // 2 seconds earlier
            resolve(cached.accessToken);
            return;
        }
        const options = {
            accessTokenUri: credentials.url + '/oauth/token',
            clientId: credentials.clientid,
            clientSecret: credentials.clientsecret,
            scopes: []
        };
        const client = new oAuthClient(options);

        const result = await client.credentials.getToken();
        const exp = new Date(result.expires);
        console.log(`access token updated, valid until ${exp.toGMTString()}`);
        cached = result;
        resolve(result.accessToken);
    });
}

module.exports = {
    token
};
