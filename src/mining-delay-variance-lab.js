const Fs = require('fs')
const Path = require('path')
const {inspect} = require('util')
const {times} = require('ramda')
const ethers = require('ethers')
const {utils: {BigNumber: BN, parseEther}} = ethers
const I = require('./i-notation.js')(BN, inspect)
const expect = require('unexpected').clone()
require('./unexpected-bn.js')(expect, BN, inspect)

const probe = x => {
    console.log(x)
    return x
}

const load = file =>
    Fs.readFileSync(Path.join(__dirname, file), 'utf-8')

const transact = (contractMethodCall) =>
    contractMethodCall.then(tx => tx.wait())

const deploy = async ({abi, bin}, args, Deployer) => {
    const contractFactory = new ethers.ContractFactory(abi, bin, Deployer)
    return (await contractFactory.deploy(...args)).deployed()
}

const sendEth = async (from, to, value) =>
    transact(from.sendTransaction({to: await to.getAddress(), value}))
// from.sendTransaction({to: await to.getAddress(), value})
//     .then(({hash})=> from.provider.waitForTransaction(hash))

const sendToken = async (fromToken, to, amt) =>
    transact(fromToken.transfer(await to.getAddress(), amt))

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
            expectToken(token, Alice)])
    }

    const expectFundsSequentially = async () => {
        const Alice = mkActor()
        await expectEth(Deployer, Alice)
        // await expectToken(token, Alice)
    }

    await expectFundsParallel()
    // await expectFundsSequentially()
    await Promise.all(times(expectFundsParallel, 10))
    console.log('Done')
}

run().catch(err => {
    // Cleanup assertion error, to make it concise
    err.parent = err.expect = undefined
    console.error(err)
})
