import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import Details from "../Details/Details.jsx";
import BidsSigleProducts from "../BIdsForSingleProducts/BidsSigleProducts.jsx";

const ProductDetails = () => {
  const loaderData = useLoaderData();
  const product = loaderData?.product || loaderData;
  const initialBids = Array.isArray(loaderData?.bids) ? loaderData.bids : [];
  const [bids, setBids] = useState(initialBids);

  const handleBidPlaced = (newBid) => {
    setBids((prev) => [newBid, ...prev]);
  };

  return (
    <>
      <Details product={product} onBidPlaced={handleBidPlaced} />
      <BidsSigleProducts bids={bids} product={product} />
    </>
  );
};

export default ProductDetails;
