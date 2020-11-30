var soap = require('soap');
var crypto = require('crypto');
var fs = require('fs');
var url = 'http://185.68.44.42:34206/?wsdl';

const private_key = fs.readFileSync('./private_keyd.pem')

async function start() {

    var client = await soap.createClientAsync(url)
    //console.log(client)

    try {

        var objectToSend = {
            key_index: 1,
            version: '1.0',
            login: 'name@website.com',
            tid: '90000015',
            ruid: '201203319999999',
            currency: 'EUR',
            action: 1
        };

        var strToSign = "";
        for (key of Object.keys(objectToSend)) {
            strToSign += objectToSend[key].toString();
            strToSign += ';';
        }
        strToSign = strToSign.slice(0, -1)
        console.log(strToSign);

        const signer = crypto.createSign('SHA256');
        signer.update(strToSign);
        const signature = signer.sign(private_key, 'base64');

        console.log('sign', signature);

        objectToSend.signature = signature;

        try {
            var response = await client.MPRSubscribeAsync(objectToSend);
            console.log(response);
        }
        catch (ex) {
            console.log(ex);
        }

    } catch (ex) {
        console.log(ex)
    }

}

start();