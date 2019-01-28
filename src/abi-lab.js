const {t, expect, I} = require('../test/helpers.js')
const Fs = require('fs')
const Path = require('path')
const R = require('ramda')
const {probe} = require('../src/fp.js')
const ABI = require('../src/abi.js')

const load = file => Fs.readFileSync(Path.join(__dirname, file), 'utf-8')
const loadContract = contractName => ({
    abi: JSON.parse(load(`../out/${contractName}.abi`)),
    bin: load(`../out/${contractName}.bin`)
})

const ERC20Token = loadContract('ERC20Token')

probe(ABI.methods(ERC20Token.abi))
