const {inspect} = require('util')
const R = require('ramda')
const ethers = require('ethers')
const {utils: {BigNumber: BN, parseEther}} = ethers
const I = require('./i-notation.js')(BN, inspect)
const Fs = require('fs')
const Path = require('path')

const loadFile = file => Fs.readFileSync(Path.join(__dirname, file), 'utf-8')

const load = contractName => ({
    NAME: contractName,
    abi: JSON.parse(loadFile(`../out/${contractName}.abi`)),
    bin: loadFile(`../out/${contractName}.bin`)
})

const withProto = proto => obj => Object.assign(Object.create(proto), obj)
const txOf = sender => tx => ({...tx, sender})

/**
 * opts: {sender, gas, gasPrice}
 * solcOut: {NAME, abi, bin}
 * */
const at = (address, opts) => solcOut =>
    withProto(withProto(solcOut)(opts))({to: address})

const make = (contract) => {
    const {bin} = contract
    return withProto(contract)({
        to: '0x0',
        data: `0x${bin}`
    })
}

module.exports = {load, loadFile, withProto, txOf, at, make}
