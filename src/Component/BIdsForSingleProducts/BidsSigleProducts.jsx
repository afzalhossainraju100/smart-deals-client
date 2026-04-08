import React from "react";
import thumbnailCard from "../../assets/thumbnail-card.png";

const BidsSigleProducts = ({ bids = [], product }) => {
  const productTitle =
    product?.title || product?.productName || product?.name || "Product";
  const productPrice =
    product?.priceRange || product?.price || product?.startingPrice || "$22.5";
  const productImage =
    (product?.image && String(product.image).trim()) ||
    (product?.imageUrl && String(product.imageUrl).trim()) ||
    (product?.productImage && String(product.productImage).trim()) ||
    thumbnailCard;

  return (
    <section className="bg-slate-100 px-4 pb-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-5xl font-extrabold text-slate-300/70">
          Only Visible to Owner
        </p>
        <h2 className="mt-2 text-4xl font-extrabold text-slate-900">
          Bids For This Products:{" "}
          <span className="text-violet-500">
            {String(bids.length).padStart(2, "0")}
          </span>
        </h2>

        <div className="mt-6 overflow-hidden rounded-md bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th>SL No</th>
                  <th>Product</th>
                  <th>Seller</th>
                  <th>Bid Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bids.length > 0 ? (
                  bids.map((bid, index) => {
                    const sellerName =
                      bid?.sellerName ||
                      bid?.buyerName ||
                      bid?.userName ||
                      "Sara Chen";
                    const sellerEmail =
                      bid?.sellerEmail ||
                      bid?.buyerEmail ||
                      bid?.email ||
                      "crafts_by_brandshop.net";
                    const bidPrice =
                      bid?.bidAmount || bid?.amount || bid?.price || "$10";

                    return (
                      <tr key={bid?._id || bid?.id || `${sellerName}-${index}`}>
                        <td className="font-semibold text-slate-700">
                          {index + 1}
                        </td>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 overflow-hidden rounded bg-slate-200">
                              <img
                                src={productImage}
                                alt={productTitle}
                                className="h-full w-full object-cover"
                                onError={(event) => {
                                  event.currentTarget.onerror = null;
                                  event.currentTarget.src = thumbnailCard;
                                }}
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">
                                {productTitle}
                              </p>
                              <p className="text-xs text-slate-500">
                                {productPrice}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="h-9 w-9 rounded-full bg-slate-300" />
                            <div>
                              <p className="text-sm font-semibold text-slate-800">
                                {sellerName}
                              </p>
                              <p className="text-xs text-slate-500">
                                {sellerEmail}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="font-bold text-slate-700">{bidPrice}</td>
                        <td>
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              className="btn btn-xs rounded border border-emerald-500 bg-transparent text-emerald-600 shadow-none hover:bg-emerald-50"
                            >
                              Accept Offer
                            </button>
                            <button
                              type="button"
                              className="btn btn-xs rounded border border-rose-500 bg-transparent text-rose-600 shadow-none hover:bg-rose-50"
                            >
                              Reject Offer
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-10 text-center text-sm text-slate-500"
                    >
                      No bids found for this product yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BidsSigleProducts;
