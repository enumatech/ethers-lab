const Fs = require('fs')
const Path = require('path')
const {inspect} = require('util')
const R = require('ramda')
const ethers = require('ethers')
const {utils: {BigNumber: BN, parseEther}} = ethers
const I = require('./i-notation.js')(BN, inspect)
const expect = require('unexpected').clone()
require('./unexpected-bn.js')(expect, BN, inspect)

const probe = x => {
    console.log(x)
    return x
}

const now = () => (new Date()).getTime()

const load = file =>
    Fs.readFileSync(Path.join(__dirname, file), 'utf-8')

let trace = {}

// Timestamp a copy of an arbitrary object
const assocTS = obj => R.assoc('TS', now(), obj)

// Store a timestamped copy of data under trace[hash][key]
const traceTX = (hash, key, data) =>
    (trace = R.assocPath([hash, key], assocTS(data), trace), data)

const transact = (contractMethodCall) =>
    contractMethodCall
        .then(tx => traceTX(tx.hash, 'tx', tx))
        .then(tx => tx.wait())
        .then(txr => traceTX(txr.transactionHash, 'txr', txr))

const deploy = async ({abi, bin}, args, Deployer) => {
    const contractFactory = new ethers.ContractFactory(abi, bin, Deployer)
    return (await contractFactory.deploy(...args)).deployed()
}

const sendEth = async (from, to, value) =>
    transact(
        from.sendTransaction({to: await to.getAddress(), value})
            .then(R.assoc('META', 'ETH transfer')))

const sendToken = async (fromToken, to, amt) =>
    transact(
        fromToken.transfer(await to.getAddress(), amt)
            .then(R.assoc('META', 'token transfer')))

const expectEth = async (from, to, ethAmt = parseEther(`10`)) => {
    await sendEth(from, to, ethAmt)
    await expect(to.getBalance(), 'to be fulfilled with', ethAmt)
}

const expectToken = async (from, to, tokenAmt = I`20`) => {
    await sendToken(from, to, tokenAmt)
    await expect(from.balanceOf(to.address), 'to be fulfilled with', tokenAmt)
}

const run = async () => {
    const rpcPath = 'http://localhost:9545'
    const chain = new ethers.providers.JsonRpcProvider(rpcPath)
    const Deployer = await chain.getSigner(0)
    const mkActor = () => ethers.Wallet.createRandom().connect(chain)
    const Alice = mkActor()

    const ERC20Token = {
        abi: JSON.parse(load('../out/ERC20Token.abi')),
        bin: load('../out/ERC20Token.bin')
    }
    const decimals = 0
    const totalSupply = I`10`.pow(6)
    const initialHolder = await Deployer.getAddress()
    const token = await deploy(ERC20Token,
        ["Test DAI", "DAI", decimals, totalSupply, initialHolder],
        Deployer)

    await expectEth(Deployer, Alice)
    await expectToken(token, Alice)

    const expectFundsParallel = async () => {
        const Alice = mkActor()
        await Promise.all([
            expectEth(Deployer, Alice),
            expectToken(token, Alice)
        ])
    }

    const expectFundsSequentially = async () => {
        const Alice = mkActor()
        await expectEth(Deployer, Alice)
        await expectToken(token, Alice)
    }

    await expectFundsParallel()
    await expectFundsSequentially()

    await Promise.all(R.times(expectFundsParallel, 100))

    const txLatency = ({tx, txr}) => [
        txr.TS - tx.TS,
        tx.blockNumber,
        txr.blockNumber,
        txr.transactionIndex,
        tx.META
    ]

    probe(R.map(txLatency, trace))

    console.log('Done')
}

run().catch(err => {
    // Cleanup assertion error, to make it concise
    err.parent = err.expect = undefined
    console.error(err)
})
