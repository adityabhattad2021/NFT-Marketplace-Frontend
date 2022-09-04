import { ethers } from "ethers"
import { useState } from "react"
import { Modal, Input, useNotification } from "web3uikit"
import nftMarketplaceABI from "../constants/NFTMarketplace.json";
import { useWeb3Contract } from "react-moralis";


export default function UpdateListingModal({ marketPlaceAddress, nftAddress, tokenId, isVisible ,onClose}) {
    // This price will be in ETH.
    const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState("")

    const dispatch = useNotification()
    


    async function handleUpdateListingSuccess(transectionResponse) {
        await transectionResponse.wait(1)
        dispatch({
            type: "success",
            message: "Listing Updated",
            title: "Listing Updated - Please refresh (and move blocks)",
            position:"topR"
        })
    }

    const { runContractFunction: UpdateListingModal } = useWeb3Contract({
        abi: nftMarketplaceABI,
        contractAddress: marketPlaceAddress,
        functionName: "updateListing",
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
            newPrice: priceToUpdateListingWith
        }
    })

    
    return (
        <Modal
            isVisible={isVisible}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={async () => {
                await UpdateListingModal({
                    onError: ((error) => { console.log(error); }),
                    onSuccess:handleUpdateListingSuccess
                })  
            }}
        >
            <Input
                label="Update Listing Price in L1 Currency (ETH)"
                name="New Listing Price"
                type="number"
                onChange={(event) => {
                    setPriceToUpdateListingWith(ethers.utils.parseEther(event.target.value))
                }}
            />
        </Modal>
    )
}