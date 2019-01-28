const {t, expect} = require('./helpers.js')
const ABI = require('../src/abi.js')

t.test(`methods`, t => {
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

t.test(`constructor`, t => {
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
