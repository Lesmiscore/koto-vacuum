const env = process.env;

const fromAddress = env.FROM_ADDRESS;
const toAddress = env.TO_ADDRESS;

const fromSecret = env.FROM_ADDRESS_PRIV ? ECPair.fromWIF(env.FROM_ADDRESS_PRIV, kotoNet) : null;

const index = require("./index");
index({ fromAddress, toAddress, fromSecret });
