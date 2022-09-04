import styles from "../styles/Home.module.css";
import Head from "next/head";
import nftMarketplaceABI from "../constants/NFTMarketplace.json";
import { Button, useNotification } from "web3uikit";
import { ethers } from "ethers";
import { useMoralis, useWeb3Contract } from "react-moralis";
import networkMapping from "../constants/networkMapping.json"

export default function Withdraw() {
	const dispatch = useNotification();
    const { chainId } = useMoralis();
    const chainIdString = chainId ? parseInt(chainId).toString() : "1337"
	const marketPlaceAddress = networkMapping[chainIdString]["NFTMarketplace"][0]

    const { runContractFunction:withdrawProceeds } = useWeb3Contract({
        abi: nftMarketplaceABI,
        contractAddress: marketPlaceAddress,
        functionName: "withDrawProceeds",
        params: {
            
        }
    })
    
    async function handleClick() {
        await withdrawProceeds({
            onError:((error)=> {
                console.log(error);
            }),
            onSuccess:handleWithdrawSuccess
        })
    }

    async function handleWithdrawSuccess(transectionResponse) {
        await transectionResponse.wait(1)
        dispatch({
            type: "success",
            message: "Proceeds transferred Successfully",
            title: "Procceds Transfer",
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
			<div className="p-8">
                <Button
                    text="Withdraw your Proceeds"
                    size="large"
                    isFullWidth="true"
                    onClick={handleClick}
                    id="withdrawBtn"
                />
			</div>
		</div>
	);
}
