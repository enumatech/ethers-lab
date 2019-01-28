const {t, expect, probe, I, ethers, testChain} = require('../test/helpers.js')
const {utils: {parseEther}} = ethers
const R = require('ramda')
const ABI = require('./abi.js')
const Contract = require('../src/contract.js')

const withNonce = wallet => ({...wallet, nextNonce: {value: I`0`}})

const run = async () => {
    const chain = testChain()
    const Deployer = await chain.getSigner(0)
    Deployer.address = await Deployer.getAddress()
    const Alice = withNonce({address: '<Alice addr>'})
    const Bob = {address: '<Bob addr>'}
    const Token = Contract.load('ERC20Token')
    Token.balanceOf = function (address) {
        return {}
    }
    const token = Contract.at('<token addr>', {sender: Alice, gas: 123})(Token)

    const mkToken = {...Contract.make(Token), gas: I`10`.pow(6)}

    probe(mkToken)

    return

    t.expect([
        Token.balanceOf(Alice),
        'to satisfy',
        {
            contract: 'ERC20Token',
            fn: 'balanceOf',
            args: [Alice],
            inputs: [],
            outputs: []
        }])


    t.expect([
        token.balanceOf(Bob),
        'to satisfy',
        {
            contract: 'ERC20Token',
            fn: 'balanceOf',
            args: [Bob],
            inputs: [],
            outputs: [],
            to: '<token addr>'
        }])

    t.expect([
        txOf(Alice)(token.balanceOf(Bob)),
        'to have keys',
        ['contract', 'fn', 'args', 'inputs', 'outputs', 'to']])


    t.expect([
        Token.abi,
        'to satisfy',
        {
            from: Alice.address,
            to: token.address,
            value: I`0`,
            nonce: I`123`,
            data: '0x0',
            fn: 'balanceOf',
            args: [Alice.address],
            abi: {
                inputs: [],
                outputs: [],
                events: {}
            },
            op: 'send', // or 'call',
            block: 'latest',
            gas: I`123`,
            gasPrice: I`123`,
        }])

    // const chain = testChain()
    // const spritesContracts = await Sprites.testEthersDeploy(chain)
    // const Alice = await Sprites.randomTestClient('Alice', spritesContracts)
    //
    // t.expect([
    //     await Sprites.balances(Alice),
    //     'to satisfy',
    //     {
    //         ETH: parseEther('10'),
    //         DAI: I`1000`
    //     }])
}

run().catch(t.threw)
