# Project Overview

This a DApp (Decentralized Application) focused on NFTs (Non-Fungible Tokens) based around books. The core idea is for a bookseller (the owner of the contract) to create NFTs linked to physical books. These books will have QR codes attached to them. When users scan these QR codes, they can acquire the book's NFT from the owner. The previous owner receives a secondary NFT as a proof of reading, which is a non-transferable NFT containing the date they transferred the book.

# Setup Instructions

## Prerequisites

Before starting, ensure you have yarn installed on your machine. These instructions are for setting up a project using scaffold-eth-2.

## Configuration

### Deploying Contracts

1. Inside the `scaffold-eth-2` directory, run `yarn install` to install the necessary dependencies.
2. Fill in the `DEPLOYER_PRIVATE_KEY` in the `.env` file within the hardhat environment. This should be from a Metamask wallet or similar. This key is required for deploying your contract to the Sepolia testnet.
3. Make sure you have some ETH in the testnet for deploying your contract. You can obtain Sepolia ETH from [Alchemy's faucet](https://www.alchemy.com/faucets/ethereum-sepolia).

### Deployment Commands

In the `scaffold-eth-2` directory, use the following commands to deploy and verify your contract on the Sepolia network:

- To deploy, run: `yarn deploy --network sepolia`
- To verify, run: `yarn verify --network sepolia` (useful for TheGraph integration later).

Remember to note the address where the contracts are deployed for later use.

### Setting Up IPFS for NFT

1. Create an account on [NFT.storage](https://nft.storage/) and obtain your API Key.
2. In the `.env` file within the nextjs environment, set `NEXT_PUBLIC_NFT_STORAGE_API_KEY` with your obtained API Key.

### Setting Up TheGraph for NFT Data

1. Create a subgraph at [The Graph's Studio](https://thegraph.com/studio/subgraph).
2. Globally install the Graph CLI with `yarn global add @graphprotocol/graph-cli` or `npm install -g @graphprotocol/graph-cli`.
3. In `booknft-subgraph/subgraph.yaml`, input the address of your previously deployed contract (likely on Sepolia). Use [Sepolia Etherscan](https://sepolia.etherscan.io/) to verify the block start of your contract if necessary.
4. Authenticate with The Graph's Studio using `graph auth --studio YOUR_ACCESS_TOKEN` (replace `YOUR_ACCESS_TOKEN` with the actual token provided on The Graph's website).
5. Navigate to the `booknft-subgraph` directory and do `npm i` and `graph codegen && graph build`
6. Deploy your subgraph with `graph deploy --studio booknft`.

Finally, update the `.env` file in the nextjs environment with your TheGraph URI API key by setting `NEXT_PUBLIC_URI_API_THEGRAPH`.

## Running the Application

1. in `.env` fill `NEXT_PUBLIC_TARGET_NETWORK` with your testnet sepolia
2. Within the `scaffold-eth-2` directory, start the application by running `yarn start`.
3. Access the application at [http://localhost:3000/](http://localhost:3000/).
