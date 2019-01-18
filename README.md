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

```
