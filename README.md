# ethers-lab

Issue reproduction testbed for `ethers.js`.

## Install

Prerequisite on both macOS and Linux:
- [Nix 2.0](https://nixos.org/nix/) package manager

This will install `geth`, `solc`, `node`, etc

```
git clone https://github.com/enumatech/ethers-lab
cd ethers-lab/
nix-shell
```

For the first time, you have to wait a few minutes until the "system
dependencies" are downloaded; subsequent `nix-shell`s should start
in a few seconds.

```
yarn install
overmind start
```

## Large mining delay variance issue

Run

```
node src/mining-delay-variance-lab.js
```

and you should see some surprising log entries on your `geth` console:

```
test-chain | INFO [01-18|18:58:08.151] Sealing paused, waiting for transactions
test-chain | INFO [01-18|18:58:08.151] Successfully sealed new block            number=21 sealhash=dbd338…b513c0 hash=209428…2c21bb elapsed=506.214µs
test-chain | INFO [01-18|18:58:08.151] 🔗 block reached canonical chain          number=14 hash=4fa8ce…c0add9
test-chain | INFO [01-18|18:58:08.151] 😱 block lost                             number=14 hash=5ed25c…cec84d
test-chain | INFO [01-18|18:58:08.151] 🔨 mined potential block                  number=21 hash=209428…2c21bb
test-chain | INFO [01-18|18:58:08.151] Submitted transaction                    fullhash=0x33a725627272d65679e92c1e1904dda991de7adf2ffc631075c50f6805babe5a recipient=0x9A8c22826909158606276eA8276701db25538612
test-chain | INFO [01-18|18:58:08.152] Commit new mining work                   number=21 sealhash=b9ce1f…8118f7 uncles=2 txs=4 gas=204452 fees=2.04452e-13 elapsed=1.226ms
test-chain | INFO [01-18|18:58:08.152] Submitted transaction                    fullhash=0xe119183f72b0c5f6867631c8749906fd205f7ca2b980e08c8531d2a8a17865cd recipient=0x9A8c22826909158606276eA8276701db25538612
test-chain | INFO [01-18|18:58:08.152] Successfully sealed new block            number=21 sealhash=b9ce1f…8118f7 hash=32f5bd…b32c99 elapsed=750.427µs
test-chain | INFO [01-18|18:58:08.152] 🔨 mined potential block                  number=21 hash=32f5bd…b32c99
```
