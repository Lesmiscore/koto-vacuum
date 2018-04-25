const env = process.env;

const zcLib = require("@missmonacoin/bitcoinjs-lib-zcash");
const TransactionBuilder = zcLib.TransactionBuilder;
const ECPair = zcLib.ECPair;

const fetch = require("node-fetch");
const request = require('request');

const kotoNet = {
    "messagePrefix": "\u0015Koto Signed Message:\n",
    "bip32": {
        "public": 76067358,
        "private": 76066276
    },
    "pubKeyHash": 6198,
    "scriptHash": 6203,
    "wif": 128
};

// change here if it's down
const insight = "https://insight.kotocoin.info/api";

const fromAddress = env.FROM_ADDRESS;
const toAddress = env.TO_ADDRESS;
const feeInSat = 10;
const fromWif = ECPair.fromWIF(env.FROM_ADDRESS_PRIV, kotoNet);

// 80 KOTO
const minimumTarget = 8e9;

function jsonFetch(addr) {
    return fetch(addr).then(e => e.json());
}

function postProm(uri, json) {
    return new Promise((resolve, reject) => {
        request.post({ uri, json, headers: {} }, (error, response, body) => {
            if (error) {
                reject(error);
            } else {
                resolve({ response, body });
            }
        });
    });
}

jsonFetch(insight + "/addr/" + fromAddress + "/utxo")
    .then(utxo => {
        if (utxo.length <= 0) {
            return Promise.reject("No UTXO: cancelling");
        }
        // it's time to build transaction
        let txb = new TransactionBuilder(kotoNet);
        let totalBalanceSat = 0;
        utxo.forEach(tx => {
            const vin = txb.addInput(tx.txid, tx.vout);
            txb.inputs[vin].value = tx.satoshis;
            totalBalanceSat += tx.satoshis;
        });
        const balanceWoFee = totalBalanceSat - feeInSat;
        if (balanceWoFee < minimumTarget) {
            return Promise.reject("Balance is less than target: expected " + minimumTarget + " but " + balanceWoFee);
        }
        txb.addOutput(toAddress, balanceWoFee);
        //console.log(txb.inputs.length);
        for (let i = 0; i < txb.inputs.length; i++)
            txb.sign(i, fromWif);
        // display it for a test
        //console.log(txb.build().toHex());
        // broadcast tx
        return postProm(insight + "/tx/send", {
            rawtx: txb.build().toHex()
        }).then(x => JSON.parse(x.body).txid);
    })
    .then(console.log)
    .catch(console.log);
