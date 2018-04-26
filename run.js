const env = process.env;

const index = require("./index");

const fromAddress = env.FROM_ADDRESS;
const toAddress = env.TO_ADDRESS;

const fromSecret = env.FROM_ADDRESS_PRIV ? env.FROM_ADDRESS_PRIV : null;

index({ fromAddress, toAddress, fromSecret })
    .then(console.log)
    .catch(console.log);
