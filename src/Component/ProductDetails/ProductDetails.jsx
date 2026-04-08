import React from "react";
import { useLoaderData } from "react-router-dom";
import Details from "../Details/Details.jsx";
import BidsSigleProducts from "../BIdsForSingleProducts/BidsSigleProducts.jsx";

const ProductDetails = () => {
  const loaderData = useLoaderData();
  const product = loaderData?.product || loaderData;
  const bids = Array.isArray(loaderData?.bids) ? loaderData.bids : [];

  return (
    <>
      <Details product={product} />
      <BidsSigleProducts bids={bids} product={product} />
    </>
  );
};

export default ProductDetails;
