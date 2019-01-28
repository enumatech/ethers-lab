const {t, expect, I} = require('./helpers.js')
const R = require('ramda')
const {probe} = require('../src/fp.js')
const ABI = require('../src/abi.js')
const Contract = require('../src/contract.js')

const Token = Contract.load('ERC20Token')

const run = async () => {
    probe(Token.abi)
}

run().catch(t.threw)
