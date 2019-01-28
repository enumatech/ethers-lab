const R = require('ramda')
const {filter, propEq, has, prop, indexBy, map, dissoc, find} = R
const {thread} = require('../src/fp.js')

const ABI = {
    // Unique method names are assumed
    methods: abi =>
        thread(abi,
            filter(propEq('type', 'function')),
            filter(has('name')),
            indexBy(prop('name')),
            map(dissoc('type'))),

    constructor: abi =>
        thread(abi,
            find(propEq('type', 'constructor')),
            dissoc('type'))
}

module.exports = ABI
