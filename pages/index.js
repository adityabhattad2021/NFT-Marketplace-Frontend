import Head from "next/head";
import { useMoralisQuery, useMoralis } from "react-moralis";
import styles from "../styles/Home.module.css";
import NFTBox from "../components/NFTBox";

export default function Home() {
	const { isWeb3Enabled } = useMoralis();

	const { data: listedNFTs, isFeatching: fetchingListedNFTs } =
		useMoralisQuery(
			// Table Name
			"ActiveItem",
			// Function for the query
			(query) => query.limit(10).descending("tokenId")
		);
	// console.log(listedNFTs);

	return (
		<div className="container mx-auto">
			<Head>
				<title>NFT Marketplace</title>
				<meta
					name="description"
					content="NFT market place using moralis indexer"
				/>
			</Head>
			<h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
			<div className="flex flex-wrap">
				{isWeb3Enabled ? (
					fetchingListedNFTs ? (
						<div>Loading...</div>
					) : (
						listedNFTs.map((nft) => {
							// console.log((nft.attributes));
							const {
								price,
								nftAddress,
								tokenId,
								marketPlaceAddress,
								seller,
							} = nft.attributes;
							return (
								<div>
									<NFTBox
										price={price}
										nftAddress={nftAddress}
										tokenId={tokenId}
										marketPlaceAddress={marketPlaceAddress}
										seller={seller}
										key={`${nftAddress}${tokenId}`}
									/>
								</div>
							);
						})
					)
				) : (
              <h1 className="py-4 px-4 font-bold text-xl">Web 3 Not Enabled, Connect your wallet to start.</h1>
				)}
			</div>
		</div>
	);
}
