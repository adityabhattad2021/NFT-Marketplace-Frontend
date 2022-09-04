import styles from "../styles/Home.module.css";
import Head from "next/head";
import basicNFTABI from "../constants/BasicNFT.json";
import nftMarketplaceABI from "../constants/NFTMarketplace.json";
import networkMapping from "../constants/networkMapping.json"
import { Form,useNotification } from "web3uikit";
import { ethers } from "ethers";
import { useMoralis, useWeb3Contract } from "react-moralis";




export default function SellNFT() {

	const dispatch = useNotification()
	const { chainId } = useMoralis()
	const chainIdString = chainId ? parseInt(chainId).toString() : "1337"
	const marketPlaceAddress = networkMapping[chainIdString]["NFTMarketplace"][0]

	const { runContractFunction } = useWeb3Contract()
	

	async function approveAndList(data) {
		console.log("Trying to Approving the marketplace for the NFT");
		const nftAddress = data.data[0].inputResult
		const tokenId = data.data[1].inputResult
		const price = ethers.utils.parseEther(data.data[2].inputResult).toString()


		const approveOptions = {
			abi: basicNFTABI,
			contractAddress: nftAddress,
			functionName: "approve",
			params: {
				to: marketPlaceAddress,
				tokenId:tokenId
			}
		}
		
		await runContractFunction({
			params: approveOptions,
			onSuccess: () => handleApproveSuccess(nftAddress, tokenId, price),
			onError: ((error) => {
				console.log(error);
			})
		})


	}


	async function handleApproveSuccess(nftAddress, tokenId, price) {
		console.log("Approved NFT for the marketplace successfully...");
		
		const listOptions = {
			abi: nftMarketplaceABI,
			contractAddress: marketPlaceAddress,
			functionName: "listItem",
			params: {
				nftAddress: nftAddress,
				tokenId: tokenId,
				price: price
			}
		}

		await runContractFunction({
			params: listOptions,
			onSuccess: handleListSuccess,
			onError:((error)=>{console.log(error)})
		})


	}


	async function handleListSuccess(transectionResponse) {
		await transectionResponse.wait(1)
		dispatch({
			type: "success",
			message: "New Listed",
			title:"NFT Listed",
			position:"topR"
		})

	}




	return (
		<div className={styles.container}>
			<Head>
				<title>Sell your NFT</title>
				<meta
					name="description"
					content="NFT market place using moralis indexer"
				/>
			</Head>
			<Form
				onSubmit={approveAndList}
				data={[
					{
						name: "NFT Address",
						type: "text",
						inputWidth: "50%",
						value: "",
						key:"nftAddress"
					},
					{
						name: "Token ID",
						type: "number",
						value: "",
						key:"tokenId"
					},
					{
						name: "Price (in ETH)",
						type: "number",
						value: "",
						key:"price"
					}
				]}
				title="List Your NFT Here:"
				id="mainFrom"
			/>
		</div>
	);
}
