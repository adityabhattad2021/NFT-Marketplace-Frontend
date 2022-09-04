// Create a new table called "Active Item"
// Add Items when they are listed on the marketplace
// Remove them when they are bought or cancelled



// Every event gets triggered twice, once on unconfirmed, again on confirmed

Moralis.Cloud.afterSave("NewItemListed", async (request) => {
	const confirmed = request.object.get("confirmed");
	const logger = Moralis.Cloud.getLogger();
	logger.info("Looking for confirmed transection");
	if (confirmed) {
		logger.info("Found Item!");
		const ActiveItem = Moralis.Object.extend("ActiveItem");

		const activeItem = new ActiveItem();
		activeItem.set("marketPlaceAddress", request.object.get("address"));
		activeItem.set("nftAddress", request.object.get("nftAddress"));
		activeItem.set("price", request.object.get("price"));
		activeItem.set("tokenId", request.object.get("tokenId"));
		activeItem.set("seller", request.object.get("seller"));

		logger.info(
			`Adding address ${request.object.get(
				"address"
			)}. Token Id : ${request.object.get("tokenId")}`
		);
		logger.info("Saving...");
		await activeItem.save();
	}
});

Moralis.Cloud.afterSave("ItemListingCancelled", async (request) => {
	const confirmed = request.object.get("confirmed");
	const logger = Moralis.Cloud.getLogger();
	logger.info(`Marketplace | Object ${JSON.stringify(request.object)}`);
	if (confirmed) {
		const ActiveItem = Moralis.Object.extend("ActiveItem");
		const query = new Moralis.Query(ActiveItem);
		query.equalTo("marketPlaceAddress", request.object.get("address"));
		query.equalTo("nftAddress", request.object.get("nftAddress"));
		query.equalTo("tokenId", request.object.get("tokenId"));
		logger.info(`Marketplace | Query: ${JSON.stringify(query)}`);
		const cancelledItem = await query.first();
		logger.info(
			`Marketplace | CancelItem: ${JSON.stringify(cancelledItem)}`
		);
		if (cancelledItem) {
			logger.info(
				`Deleting object with token id ${request.object.get(
					"tokenId"
				)} at address ${request.object.get(
					"address"
				)} since it was cancelled.`
			);
			await cancelledItem.destroy();
		} else {
			logger.info(
				`No item found with address ${request.object.get(
					"nftAddress"
				)} and tokenId ${request.object.get("tokenId")}.`
			);
		}
	}
});

Moralis.Cloud.afterSave("ItemBought", async (request) => {
	const confirmed = request.object.get("confirmed");
	const logger = Moralis.Cloud.getLogger();
	logger.info(`Marketplace | Object ${JSON.stringify(request.object)}`);

	if (confirmed) {
		const ActiveItem = Moralis.Object.extend("ActiveItem");
		const query = new Moralis.Query(ActiveItem);
		query.equalTo("marketPlaceAddress", request.object.get("address"));
		query.equalTo("nftAddress", request.object.get("nftAddress"));
		query.equalTo("tokenId", request.object.get("tokenId"));
		logger.info(`Marketplace | Query ${JSON.stringify(query)}`);
		const boughtItem = await query.first();
		logger.info(`Marketplace | BoughtItem ${JSON.stringify(boughtItem)}`);
		if (boughtItem) {
			logger.info(`Deleting ${request.object.get("tokenId")}`);
			await boughtItem.destroy();
		} else {
			logger.info(
				`No item found with address ${request.object.get(
					"nftAddress"
				)} and token id ${request.object.get("tokenId")}`
			);
		}
	}
});

Moralis.Cloud.afterSave("ItemPriceUpdated", async (request) => {
	const confirmed = request.object.get("confirmed");
	const logger = Moralis.Cloud.getLogger();
	logger.info(`Marketplace | Object ${JSON.stringify(request.object)}`);
	if (confirmed) {
		const ActiveItem = Moralis.Object.extend("ActiveItem");
		const query = new Moralis.Query(ActiveItem);
		query.equalTo("marketPlaceAddress", request.object.get("address"));
		query.equalTo("nftAddress", request.object.get("nftAddress"));
		query.equalTo("tokenId", request.object.get("tokenId"));
		logger.info(`Marketplace | Query: ${JSON.stringify(query)}`);
		const updateItem = await query.first();
		logger.info(`Marketplace | UpdateItem: ${JSON.stringify(updateItem)}`);
		if (updateItem) {
			logger.info(
				`Deleting object with token id ${request.object.get(
					"tokenId"
				)} at address ${request.object.get(
					"address"
				)} to and re-listing it with new price`
			);
			await updateItem.destroy();

			// Creating new item with new price
			const activeItem = new ActiveItem();
			activeItem.set("marketPlaceAddress", request.object.get("address"));
			activeItem.set("nftAddress", request.object.get("nftAddress"));
			activeItem.set("price", request.object.get("price"));
			activeItem.set("tokenId", request.object.get("tokenId"));
			activeItem.set("seller", request.object.get("seller"));
			logger.info(
				`Relisiting item with token id ${request.object.get("tokenId")} and address ${request.object.get("nftAddress")}`
			);
			await activeItem.save()
		} else {
			logger.info(
				`No item found with address ${request.object.get(
					"nftAddress"
				)} and tokenId ${request.object.get("tokenId")}.`
			);
		}
	}
});
