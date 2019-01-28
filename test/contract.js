const {t, expect, I, ethers, testChain} = require('./helpers.js')
const {utils: {parseEther}} = ethers
const Fs = require('fs')
const Path = require('path')
const R = require('ramda')
const {probe} = require('../src/fp.js')

const load = file => Fs.readFileSync(Path.join(__dirname, file), 'utf-8')
const loadContract = contractName => ({
    abi: load(`../out/${contractName}.abi`),
    bin: load(`../out/${contractName}.bin`)
})

const ERC20Token = loadContract('ERC20Token')

ERC20Token.balanceOf = function (address) {
    return {}
}

const withProto = proto => obj => Object.assign(Object.create(proto), obj)
const txOf = sender => tx => ({...tx, sender})
const withNonce = wallet => ({...wallet, nextNonce: {value: I`0`}})

// opts: {sender, gas, gasPrice}
// solcOut: {NAME, abi, bin}
const contractAt = (address, opts) => solcOut =>
    withProto(withProto(solcOut)(opts))({to: address})

const ABI = require('../abi.js')

const run = async () => {
    const Alice = withNonce({address: '<Alice addr>'})
    const Bob = {address: '<Bob addr>'}
    const token = contractAt('<token addr>', {sender: Alice, gas: 123})(ERC20Token)

    t.test(`ABI.methods`, t => {
        t.expect([
            ABI.methods([
                {name: 'method1', type: 'function'},
                {name: 'method2', type: 'function'}
            ]),
            'to have keys',
            ['method1', 'method2']
        ], `indexes function interfaces by their name`)

        t.expect([
            ABI.methods([{name: 'method1', type: 'function'}]),
            'to satisfy',
            {method1: {name: 'method1'}}
        ], `retains method names`)

        t.expect([
            ABI.methods([{name: 'method1', type: 'function'}]),
            'to satisfy',
            {method1: expect.it('not to have property', 'type')}
        ], `drops the now obvious 'type' field`)

        t.expect([
            ABI.methods([
                {name: '<method>', type: 'function'},
                {name: '<event>', type: 'event'},
                {name: '<constructor>', type: 'constructor'}
            ]),
            'to not have keys',
            ['<event>', '<constructor>']
        ], `omits non-function interfaces`)

        t.expect([
            ABI.methods([{type: 'function'}]),
            'to equal',
            {}
        ], `ignores anonymous functions`)

        t.end()
    })

    t.test(`ABI.constructor`, t => {
        t.expect([
            ABI.constructor([{inputs: '<inputs>', type: 'constructor'}]),
            'to satisfy',
            {inputs: '<inputs>'}
        ], `returns constructor properties`)

        t.expect([
            ABI.constructor([{inputs: '<inputs>', type: 'constructor'}]),
            'not to have property',
            'type'
        ], `drops the now obvious 'type' field`)

        t.end()
    })

    return

    t.expect([
        ERC20Token.balanceOf(Alice),
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
        ERC20Token.abi,
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
