const Moralis = require("moralis/node");
require("dotenv").config();

const contractAddresses = require("./constants/networkMapping.json");
let chainId = process.env.chainId || 1337;
let moralisChainId = process.env.chainId == "31337" ? "1337" : chainId;
const contractAddress = contractAddresses[chainId]["NFTMarketplace"][0];

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
const appId = process.env.NEXT_PUBLIC_APP_ID;
const masterKey = process.env.moralisMasterKey;

async function main() {
	await Moralis.start({ serverUrl, appId, masterKey });
	console.log(`Working with contract address ${contractAddress}`);

	let itemListedOptions = {
		chainId: moralisChainId,
		sync_historical: true,
		topic: "NewItemListed(address,address,uint256,uint256)",
		address: contractAddress,
		abi: {
			anonymous: false,
			inputs: [
				{
					indexed: true,
					internalType: "address",
					name: "seller",
					type: "address",
				},
				{
					indexed: true,
					internalType: "address",
					name: "nftAddress",
					type: "address",
				},
				{
					indexed: true,
					internalType: "uint256",
					name: "tokenId",
					type: "uint256",
				},
				{
					indexed: false,
					internalType: "uint256",
					name: "price",
					type: "uint256",
				},
			],
			name: "NewItemListed",
			type: "event",
		},
		tableName: "NewItemListed",
	};

	let itemBoughtOptions = {
		chainId: moralisChainId,
		address: contractAddress,
		sync_historical: true,
		topic: "ItemBought(address,address,uint256,uint256)",
		abi: {
			anonymous: false,
			inputs: [
				{
					indexed: true,
					internalType: "address",
					name: "buyer",
					type: "address",
				},
				{
					indexed: true,
					internalType: "address",
					name: "nftAddress",
					type: "address",
				},
				{
					indexed: true,
					internalType: "uint256",
					name: "tokenId",
					type: "uint256",
				},
				{
					indexed: false,
					internalType: "uint256",
					name: "price",
					type: "uint256",
				},
			],
			name: "ItemBought",
			type: "event",
		},
		tableName: "ItemBought",
	};

	let itemUpdatedOptions = {
		chainId: moralisChainId,
		address: contractAddress,
		topic: "ItemPriceUpdated(address,address,uint256,uint256)",
		sync_historical: true,
		abi: {
			anonymous: false,
			inputs: [
				{
					indexed: true,
					internalType: "address",
					name: "seller",
					type: "address",
				},
				{
					indexed: true,
					internalType: "address",
					name: "nftAddress",
					type: "address",
				},
				{
					indexed: true,
					internalType: "uint256",
					name: "tokenId",
					type: "uint256",
				},
				{
					indexed: false,
					internalType: "uint256",
					name: "price",
					type: "uint256",
				},
			],
			name: "ItemPriceUpdated",
			type: "event",
		},
		tableName: "ItemPriceUpdated",
	};

	let itemCancelledOptions = {
		chainId: moralisChainId,
		address: contractAddress,
		topic: "ItemListingCancelled(address,address,uint256)",
		sync_historical: true,
		abi: {
			anonymous: false,
			inputs: [
				{
					indexed: true,
					internalType: "address",
					name: "owner",
					type: "address",
				},
				{
					indexed: true,
					internalType: "address",
					name: "nftAddress",
					type: "address",
				},
				{
					indexed: true,
					internalType: "uint256",
					name: "tokenId",
					type: "uint256",
				},
			],
			name: "ItemListingCancelled",
			type: "event",
		},
		tableName: "ItemListingCancelled",
	};

	try {	
		const listedResponse = await Moralis.Cloud.run("watchContractEvent", itemListedOptions, {
			useMasterKey:true,
		})
	
		const boughtResponse = await Moralis.Cloud.run("watchContractEvent", itemBoughtOptions, {
			useMasterKey:true,
		})
	
		const updateResponse = await Moralis.Cloud.run("watchContractEvent", itemUpdatedOptions, {
			useMasterKey:true,
		})
	
		const deleteResponse = await Moralis.Cloud.run("watchContractEvent",itemCancelledOptions, {
			useMasterKey: true,
		})

		if (listedResponse.success && boughtResponse.success && updateResponse.success && deleteResponse.success) {
			console.log("Success, database updated with watch events.");
		}

	} catch (error) {
		console.log("----------------------------------------------------------------");
		console.log("Something went wrong, here is the error log");
		console.log(error);
		console.log("----------------------------------------------------------------");

	}


}

main()
	.then(() => {
		process.exit(0);
	})
	.catch((error) => {
		console.log(error);
		process.exit(1);
	});
