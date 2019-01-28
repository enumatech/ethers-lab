const tap = require('tap')
const unexpected = require('unexpected')
const {inspect} = require('util')

/* Returns a function which accepts a BigNumber constructor,
* which allows using ethers.js' own BigNumber implementation,
* which is actually a non-decimal, BN variant. */
module.exports = function ({BN, BigNumber} = {}) {
    const expect = unexpected.clone()

    let D
    if (BigNumber) {
        D = require('../src/d-notation.js')(BigNumber, inspect)
        require('../src/unexpected-bignumber.js')(expect, BigNumber)
    }

    let I
    if (BN) {
        I = require('../src/i-notation.js')(BN, inspect)
        require('../src/unexpected-bn.js')(expect, BN)
    }

    const t = require('./tap-unexpected.js')(tap, expect)

    return {
        tap,
        unexpected,
        BigNumber,
        D,
        I,
        inspect,
        expect,
        t
    }
}
