const ethers = require('ethers')
const {utils: {BigNumber: BN}} = ethers
const BigNumber = undefined
const tapPlus = require('./tap-plus.js')({BN, BigNumber})
const {t, inspect} = tapPlus
const FP = require('../src/fp.js')
const Path = require('path')

const ipcPath = Path.join(__dirname, '..', 'test-chain.ipc')
const rpcPath = 'http://localhost:9545'

/* Define inspectors for ethers classes */
const inspectWallet = function () {
    return `${this.NAME || 'wallet'}(${this.address})`
}
ethers.Wallet.prototype[inspect.custom] = inspectWallet
ethers.Wallet.prototype[Symbol.toPrimitive] = inspectWallet

const inspectSigner = function () {
    return `${this.NAME || 'signer'}(${inspect(this.getAddress())})`
}
ethers.Signer.prototype[inspect.custom] = inspectSigner
ethers.Signer.prototype[Symbol.toPrimitive] = inspectSigner

const inspectContract = function () {
    return `${this.NAME || 'contract'}(${this.address})`
}
ethers.Contract.prototype[inspect.custom] = inspectContract
ethers.Contract.prototype[Symbol.toPrimitive] = inspectContract

const Helpers = {
    ...tapPlus, ...FP, ethers, BigNumber, ipcPath, rpcPath,

    testChain() {
        // return new ethers.providers.JsonRpcProvider(rpcPath)
        return new ethers.providers.IpcProvider(ipcPath)
    }
}

module.exports = Helpers

// Show up nicely in test output when the external test runner
// runs it accidentally.
if (module === require.main) {
    t.pass('ok')
    return
}